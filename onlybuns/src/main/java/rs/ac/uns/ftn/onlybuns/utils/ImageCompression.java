package rs.ac.uns.ftn.onlybuns.utils;

import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;

@Component
public class ImageCompression {

    // Define the folder path for storing compressed images
    private static final String COMPRESSED_FOLDER_PATH = "/compressed_images";

    // Method to compress an image from file path and save to a new file path
    public String compressImage(String inputImagePath, float quality) throws IOException {
        // Read the image from the input file path
        inputImagePath = "../public/" + inputImagePath;
        BufferedImage image = ImageIO.read(new File(inputImagePath));

        // Create the compressed images folder if it doesn't exist
        Files.createDirectories(Paths.get(COMPRESSED_FOLDER_PATH));

        // Define the output path for the compressed image (in the compressed folder)
        String outputImagePath = COMPRESSED_FOLDER_PATH + "/" +
                new File(inputImagePath).getName().replace(".", "_compressed.");

        // Ensure the output file is of the JPG format
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) {
            throw new IllegalStateException("No writers found for JPG format");
        }
        ImageWriter writer = writers.next();

        // Set up output stream and compression parameters
        File outputFile = new File("../public/" + outputImagePath);
        ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(outputFile);
        writer.setOutput(imageOutputStream);

        javax.imageio.plugins.jpeg.JPEGImageWriteParam param = new javax.imageio.plugins.jpeg.JPEGImageWriteParam(null);
        param.setCompressionMode(javax.imageio.ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality);

        writer.write(null, new javax.imageio.IIOImage(image, null, null), param);
        imageOutputStream.close();

        // Return the path to the compressed image file
        return outputImagePath;
    }
}
