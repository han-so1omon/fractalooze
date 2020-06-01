package main

import (
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"gonum.org/v1/gonum/mat"
	"math"
	"math/rand"

	"github.com/disintegration/imaging"
	"image"
	"image/color"
	"image/gif"
	_ "image/jpeg"
	_ "image/png"

	//"context"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var (
	allowedOrigins = []string{
		//"http://192.168.1.37:5001",
		"https://fractalooze.netlify.app",
		"https://errcsool.com/portfolio/fractal-image-compression",
	}
	ErrOriginNotAllowed = errors.New("Origin not allowed")
)

func isAllowedOrigin(origin string) bool {
	for _, o := range allowedOrigins {
		if origin == o {
			return true
		}
	}
	return false
}

type candidate struct {
	direction bool
	angle     float64
}

var candidates []candidate

type imgBlock struct {
	k         int
	l         int
	direction bool
	angle     float64
	imgMat    *mat.Dense
}

type transformation struct {
	k          int
	l          int
	direction  bool
	angle      float64
	contrast   float64
	brightness float64
	exists     bool
}

func pyFormattedMat(m mat.Matrix) fmt.Formatter {
	return Formatted(m, Prefix("    "), FormatPython())
}

func csvFormattedMat(m mat.Matrix) fmt.Formatter {
	return Formatted(m, Prefix("    "), FormatCSV())
}

func dirFromBool(b bool) int {
	if b {
		return -1
	}
	return 1
}

func makeCandidates() {
	var directions []bool = []bool{false, true}
	var angles []float64 = []float64{0, 90, 180, 270}
	if len(candidates) == 0 {
		for _, d := range directions {
			for _, a := range angles {
				candidates = append(candidates, candidate{d, a})
			}
		}
	}
}

func getGrayscaleImage(img image.Image) *image.Gray {
	var (
		bounds = img.Bounds()
		gray   = image.NewGray(image.Rect(0, 0, bounds.Max.X, bounds.Max.Y))
	)
	for x := bounds.Min.X; x < bounds.Max.X; x++ {
		for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
			var rgba = img.At(x, y)
			gray.Set(x-bounds.Min.X, y-bounds.Min.Y, rgba)
		}
	}

	return gray
}

func getPalettedImage(img image.Image, p color.Palette) *image.Paletted {
	var (
		bounds   = img.Bounds()
		paletted = image.NewPaletted(image.Rect(0, 0, bounds.Max.X, bounds.Max.Y), p)
	)
	for x := bounds.Min.X; x < bounds.Max.X; x++ {
		for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
			var rgba = img.At(x, y)
			paletted.Set(x-bounds.Min.X, y-bounds.Min.Y, rgba)
		}
	}

	return paletted
}

func meanGrayPixel(img *image.Gray, xmin, xmax, ymin, ymax int) uint8 {
	neighborhoodSize := (xmax - xmin) * (ymax - ymin)
	var meanVal int = 0
	for x := xmin; x < xmax; x++ {
		for y := ymin; y < ymax; y++ {
			meanVal += int(img.GrayAt(x, y).Y)
		}
	}
	meanVal /= neighborhoodSize
	return uint8(meanVal)
}

func reduce(img image.Image, factor int) *image.Gray {
	var (
		origBounds     = img.Bounds()
		origBoundsLenX = origBounds.Max.X - origBounds.Min.X
		origBoundsLenY = origBounds.Max.Y - origBounds.Min.Y
		reducedImg     = image.NewGray(image.Rect(0, 0, origBoundsLenX/factor, origBoundsLenY/factor))
		newBounds      = reducedImg.Bounds()
	)

	for x := 0; x < newBounds.Max.X; x++ {
		for y := 0; y < newBounds.Max.Y; y++ {
			var reducedPixel = meanGrayPixel(
				img.(*image.Gray),
				origBounds.Min.X+x*factor,
				origBounds.Min.X+(x+1)*factor,
				origBounds.Min.Y+y*factor,
				origBounds.Min.Y+(y+1)*factor)
			reducedImg.SetGray(x, y, color.Gray{reducedPixel})
		}
	}

	return reducedImg
}

func rotate(img image.Image, angle float64) *image.Gray {
	return getGrayscaleImage(imaging.Rotate(img, angle, color.Gray{0}))
}

func flip(img image.Image, direction bool) *image.Gray {
	if !direction {
		return img.(*image.Gray)
	}
	return getGrayscaleImage(imaging.FlipV(img))
}

func grayToMat(img *image.Gray) *mat.Dense {
	bounds := img.Bounds()
	xSize := bounds.Max.X - bounds.Min.X
	ySize := bounds.Max.Y - bounds.Min.Y
	ret := mat.NewDense(ySize, xSize, nil)

	for i := 0; i < ySize; i++ {
		for j := 0; j < xSize; j++ {
			ret.Set(i, j, float64(img.GrayAt(j+bounds.Min.X, i+bounds.Min.Y).Y))
		}
	}

	return ret
}

func adjustContrastAndBrightness(m *mat.Dense, contrast, brightness float64) *mat.Dense {
	//S = contrast*S + brightness
	r, c := m.Dims()
	ret := mat.NewDense(r, c, nil)
	ret.Copy(m)
	ret.Scale(contrast, m)
	ret.Apply(
		func(i, j int, v float64) float64 {
			return v + brightness
		},
		ret,
	)

	return ret
}

func applyTransformation(
	img image.Image,
	direction bool,
	angle float64,
	contrast, brightness float64) *mat.Dense {
	return adjustContrastAndBrightness(
		grayToMat(rotate(flip(img, direction), angle)),
		contrast,
		brightness,
	)
}

func ones(n int) []float64 {
	var data []float64
	for i := 0; i < n; i++ {
		data = append(data, 1.0)
	}
	return data
}

func flattenImage(S image.Image) []uint8 {
	var res []uint8
	bounds := S.Bounds()

	xMax := bounds.Max.X - bounds.Min.X
	yMax := bounds.Max.Y - bounds.Min.Y
	for i := 0; i < yMax; i++ {
		for j := 0; j < xMax; j++ {
			res = append(res, S.(*image.Gray).GrayAt(bounds.Min.Y+i, bounds.Min.X+j).Y)
		}
	}

	return res
}

func uint8ToFloat64(arr []uint8) []float64 {
	ret := make([]float64, len(arr))
	for i, e := range arr {
		ret[i] = float64(e)
	}
	return ret
}

func newShape(m *mat.Dense, r, c int) *mat.Dense {
	ret := mat.NewDense(r, c, nil)
	oldR, oldC := m.Dims()
	var newI, newJ int
	for i := 0; i < oldR; i++ {
		for j := 0; j < oldC; j++ {
			ret.Set(newI, newJ, m.At(i, j))
			newJ = (newJ + 1) % c
			if newJ == 0 {
				newI++
			}
		}
	}

	return ret
}

func getColData(m *mat.Dense, c int) []float64 {
	mR, _ := m.Dims()
	ret := make([]float64, mR)
	for i := 0; i < mR; i++ {
		ret[i] = m.At(i, c)
	}

	return ret
}

func findContrastAndBrightness(D, S *mat.Dense) (float64, float64) {
	// Fit the contrast and the brightness
	r, c := D.Dims()
	flatLen := r * c
	A := mat.NewDense(flatLen, 2, nil)
	A.SetCol(0, ones(flatLen))
	SFlat := newShape(S, flatLen, 1)
	A.SetCol(1, getColData(SFlat, 0))
	b := newShape(D, flatLen, 1)
	x := mat.NewDense(2, 1, nil)
	x.Solve(A, b)
	//testCsvFile.WriteString(fmt.Sprintf("%.2f\n", csvFormattedMat(A)))
	//testCsvFile2.WriteString(fmt.Sprintf("%.2f\n", csvFormattedMat(b)))
	//testCsvFile.WriteString(fmt.Sprintf("%.2f\n", csvFormattedMat(x)))
	return x.At(1, 0), x.At(0, 0)
}

func generateAllTransformedBlocks(img image.Image, sourceSize, destinationSize, step int) []imgBlock {
	factor := sourceSize / destinationSize
	var transformedBlocks []imgBlock
	bounds := img.Bounds()
	kRange := (bounds.Max.Y-bounds.Min.Y-sourceSize)/step + 1
	lRange := (bounds.Max.X-bounds.Min.X-sourceSize)/step + 1
	for k := 0; k < kRange; k++ {
		for l := 0; l < lRange; l++ {
			S := reduce(img.(*image.Gray).SubImage(
				image.Rect(
					l*step,
					k*step,
					l*step+sourceSize,
					k*step+sourceSize,
				)),
				factor,
			)
			for _, cand := range candidates {
				transformedBlocks = append(
					transformedBlocks,
					imgBlock{
						k:         k,
						l:         l,
						direction: cand.direction,
						angle:     cand.angle,
						imgMat:    applyTransformation(S, cand.direction, cand.angle, 1.0, 0.0),
					},
				)
				//T := applyTransformation(S, cand.direction, cand.angle, 1.0, 0.0)
				//testCsvFile.WriteString(fmt.Sprintf("%.2f\n", csvFormattedMat(T)))
			}
		}
	}

	return transformedBlocks
}

func compress(img image.Image, sourceSize, destinationSize, step int) [][]transformation {
	var transformations [][]transformation
	transformedBlocks := generateAllTransformedBlocks(img, sourceSize, destinationSize, step)
	bounds := img.Bounds()
	iRange := (bounds.Max.Y - bounds.Min.Y) / destinationSize
	jRange := (bounds.Max.X - bounds.Min.X) / destinationSize
	for i := 0; i < iRange; i++ {
		transformations = append(transformations, []transformation{})
		for j := 0; j < jRange; j++ {
			//fmt.Printf("%d/%d ; %d/%d\n", i+1, iRange, j+1, jRange)
			transformations[i] = append(transformations[i], transformation{exists: false})
			minD := math.Inf(1)
			D := grayToMat(img.(*image.Gray).SubImage(
				image.Rect(
					j*destinationSize,
					i*destinationSize,
					(j+1)*destinationSize,
					(i+1)*destinationSize,
				),
			).(*image.Gray))

			for _, block := range transformedBlocks {
				//testCsvFile.WriteString(fmt.Sprintf("%.2f\n", csvFormattedMat(block.imgMat)))
				//testCsvFile2.WriteString(fmt.Sprintf("%.2f\n", csvFormattedMat(D)))
				contrast, brightness := findContrastAndBrightness(D, block.imgMat)
				//testCsvFile.WriteString(fmt.Sprintf("%f,%f\n", contrast, brightness))
				S := adjustContrastAndBrightness(block.imgMat, contrast, brightness)
				r, c := D.Dims()
				diff := mat.NewDense(r, c, nil)
				diff.Sub(D, S)
				diff.MulElem(diff, diff)
				d := mat.Sum(diff)
				if d < minD {
					minD = d
					transformations[i][j] = transformation{
						block.k,
						block.l,
						block.direction,
						block.angle,
						contrast,
						brightness,
						true,
					}
				}
				/*
					testCsvFile.WriteString(
						fmt.Sprintf("%f,%d,%d,%d,%d,%f,%f\n",
							d, block.k, block.l, dirFromBool(block.direction), int(block.angle), contrast, brightness,
						),
					)
				*/
			}
		}
	}

	return transformations
}

func setSubImageFromMat(
	img *image.Gray,
	xmin, xmax, ymin, ymax int,
	subImgMat *mat.Dense,
) {
	for i := xmin; i < xmax; i++ {
		for j := ymin; j < ymax; j++ {
			val := subImgMat.At(i-xmin, j-ymin)
			if val >= 0 {
				img.SetGray(j, i, color.Gray{uint8(val)})
			}
		}
	}
}

func decompress(
	transformations [][]transformation,
	sourceSize, destinationSize, step, nbIter int,
) []*image.Gray {
	factor := sourceSize / destinationSize
	height := len(transformations) * destinationSize
	width := len(transformations[0]) * destinationSize
	randomImage := image.NewGray(image.Rect(0, 0, width, height))
	for i := 0; i < width; i++ {
		for j := 0; j < height; j++ {
			randomImage.SetGray(i, j, color.Gray{uint8(rand.Intn(256))})
		}
	}
	iterations := []*image.Gray{randomImage}

	rect := image.Rect(0, 0, width, height)
	curImg := image.NewGray(rect)
	for iIter := 0; iIter < nbIter; iIter++ {
		//fmt.Println(iIter + 1)
		for i := 0; i < len(transformations); i++ {
			for j := 0; j < len(transformations[i]); j++ {
				blockTransformation := transformations[i][j]
				S := reduce(
					iterations[len(iterations)-1].SubImage(
						image.Rect(
							blockTransformation.l*step,
							blockTransformation.k*step,
							blockTransformation.l*step+sourceSize,
							blockTransformation.k*step+sourceSize,
						),
					),
					factor,
				)
				D := applyTransformation(
					S,
					blockTransformation.direction,
					blockTransformation.angle,
					blockTransformation.contrast,
					blockTransformation.brightness,
				)
				setSubImageFromMat(
					curImg,
					i*destinationSize, (i+1)*destinationSize,
					j*destinationSize, (j+1)*destinationSize,
					D,
				)
			}
		}
		iterations = append(iterations, curImg)
		curImg = image.NewGray(rect)
	}

	return iterations
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	resp := events.APIGatewayProxyResponse{Headers: make(map[string]string)}

	var host string
	host, ok := request.Headers["Origin"]
	if !ok {
		host, ok = request.Headers["origin"]
	}
	if !ok || !isAllowedOrigin(host) {
		return events.APIGatewayProxyResponse{StatusCode: 403}, ErrOriginNotAllowed
	}
	resp.Headers["Access-Control-Allow-Origin"] = host
	//resp.Headers["Access-Control-Allow-Origin"] = "*"
	resp.Headers["Access-Control-Allow-Headers"] = "*"
	resp.Headers["Access-Control-Allow-Methods"] = "POST"
	resp.Headers["Access-Control-Allow-Credentials"] = "true"

	rawImgBeginIdx := strings.Index(request.Body, ",")
	body, err := base64.StdEncoding.DecodeString(request.Body[rawImgBeginIdx+1:])
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}
	imgOrig, _, err := image.Decode(bytes.NewReader(body))
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	grayscaleImage := getGrayscaleImage(imgOrig)

	imgOrigBounds := imgOrig.Bounds()
	imgOrigW := imgOrigBounds.Max.X - imgOrigBounds.Min.X
	imgOrigH := imgOrigBounds.Max.Y - imgOrigBounds.Min.Y
	reductionRatioW := imgOrigW / 64
	reductionRatioH := imgOrigH / 64
	reductionRatio := int(math.Max(float64(reductionRatioW), float64(reductionRatioH)))
	if reductionRatio == 0 {
		reductionRatio = 1
	}
	grayscaleImage = reduce(grayscaleImage, reductionRatio)

	transformations := compress(grayscaleImage, 8, 4, 8)
	iterations := decompress(transformations, 8, 4, 8, 12)

	buffer := new(bytes.Buffer)
	animation := gif.GIF{}
	grayPalette := []color.Color{color.Gray{0}}
	for i := 1; i <= 255; i++ {
		grayPalette = append(grayPalette, color.Gray{uint8(i)})
	}
	midIteration := len(iterations)
	for i := len(iterations) - 1; i >= 0; i-- {
		iterations = append(iterations, iterations[i])
	}
	for i, iteration := range iterations {
		animation.Delay = append(
			animation.Delay,
			3*int(math.Abs(float64(midIteration-i))),
		)
		animation.Image = append(animation.Image, getPalettedImage(iteration, grayPalette))
	}

	if err := gif.EncodeAll(buffer, &animation); err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	resp.StatusCode = 200
	resp.Body = base64.StdEncoding.EncodeToString(buffer.Bytes())

	return resp, nil
}

func main() {
	makeCandidates()
	lambda.Start(handler)
}
