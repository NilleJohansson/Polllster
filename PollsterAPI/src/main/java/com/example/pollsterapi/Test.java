package com.example.pollsterapi;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Test {
    public static void main(String[] args) {
        String filePath = "C:\\Users\\Niklas\\Documents\\adventOfCode3.txt";

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            String numberRegex = "(do\\(\\))|(don't\\(\\))|(mul\\((\\d+),(\\d+)\\))";
            int totalSum = 0;
            boolean enable = true;
            while ((line = reader.readLine()) != null) {
                    Pattern pattern = Pattern.compile(numberRegex);
                    Matcher matcher = pattern.matcher(line);

                    while (matcher.find()) {
                        if (matcher.group(1) != null) {
                            enable = true;
                        }

                        if (matcher.group(2) != null) {
                            enable = false;
                        }

                        if (matcher.group(3) != null && enable) {
                            int val1 = Integer.parseInt(matcher.group(4));
                            int val2 = Integer.parseInt(matcher.group(5));

                            totalSum += (val1 * val2);
                        }
                    }
                }
            System.out.println(totalSum);
            System.out.println(totalSum);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

//173517243