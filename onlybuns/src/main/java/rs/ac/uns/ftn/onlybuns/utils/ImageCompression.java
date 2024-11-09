package rs.ac.uns.ftn.onlybuns.utils;

// src/main/java/com/yourapp/utils/ImageCompression.java

import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

@Component
public class ImageCompression {

    // Method to compress an image (takes byte[] and compression quality as arguments)
    public byte[] compressImage(byte[] imageData, float quality) throws IOException {
        // Convert byte[] to BufferedImage
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(imageData);
        BufferedImage image = ImageIO.read(byteArrayInputStream);

        // Compress the image and write it to ByteArrayOutputStream
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) {
            throw new IllegalStateException("No writers found for JPG format");
        }
        ImageWriter writer = writers.next();

        ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(byteArrayOutputStream);
        writer.setOutput(imageOutputStream);

        javax.imageio.plugins.jpeg.JPEGImageWriteParam param = new javax.imageio.plugins.jpeg.JPEGImageWriteParam(null);
        param.setCompressionMode(javax.imageio.ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality);

        writer.write(null, new javax.imageio.IIOImage(image, null, null), param);
        imageOutputStream.close();

        return byteArrayOutputStream.toByteArray();  // Return the compressed image as byte[]
    }
}
