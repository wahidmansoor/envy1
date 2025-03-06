import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extracts text from PDF using multiple methods for robustness
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromPDF(filePath) {
  try {
    console.log(`Extracting text from: ${filePath}`);
    
    // Handle BC Cancer protocol files specially
    const fileName = path.basename(filePath);
    if (fileName.startsWith('BRAJ') || fileName.startsWith('BRAV')) {
      console.log('Detected BC Cancer protocol, using specialized extraction...');
      return bcCancerExtraction(filePath);
    }
    
    // Attempt primary extraction with pdf-parse
    let text = await primaryExtraction(filePath);
    
    // Check if extraction was successful enough
    if (isExtractionSuccessful(text, filePath)) {
      return sanitizeText(text);
    }
    
    // If primary extraction fails or is incomplete, try backup method
    console.log(`Primary extraction insufficient for ${path.basename(filePath)}. Trying backup method...`);
    text = await backupExtraction(filePath);
    
    return sanitizeText(text);
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error.message);
    return "";
  }
}

/**
 * Special extraction for BC Cancer protocols that have a known format
 */
async function bcCancerExtraction(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    
    // First try with custom render specifically for BC Cancer PDFs
    const options = {
      pagerender: bcCancerRenderPage,
      max: 0
    };
    
    const pdfData = await pdfParse(dataBuffer, options);
    
    // If we got a good amount of text, return it
    if (pdfData.text && pdfData.text.length > 500) {
      return sanitizeText(pdfData.text);
    }
    
    // Otherwise, try page by page extraction
    const pageCount = pdfData.numpages;
    let fullText = '';
    
    for (let i = 1; i <= pageCount; i++) {
      try {
        const pageOptions = {
          pagerender: bcCancerRenderPage,
          max: 1,
          firstPage: i
        };
        
        const pageData = await pdfParse(dataBuffer, pageOptions);
        if (pageData.text) {
          fullText += pageData.text + '\n\n';
        }
      } catch (err) {
        console.warn(`Warning: Error extracting text from page ${i}: ${err.message}`);
      }
    }
    
    return sanitizeText(fullText);
  } catch (error) {
    console.error(`BC Cancer extraction failed: ${error.message}`);
    // Fall back to regular extraction methods
    return await backupExtraction(filePath);
  }
}

/**
 * Custom renderer for BC Cancer protocols
 */
function bcCancerRenderPage(pageData) {
  const renderOptions = {
    normalizeWhitespace: false,
    disableCombineTextItems: true
  };
  
  return pageData.getTextContent(renderOptions)
    .then(function(textContent) {
      let text = '';
      
      // Process by lines based on y-position
      const lines = {};
      
      // Group text items by vertical position to identify lines
      textContent.items.forEach(item => {
        const y = Math.round(item.transform[5]); // Round y to handle slight variations
        if (!lines[y]) lines[y] = [];
        lines[y].push(item);
      });
      
      // Sort lines by vertical position (top to bottom in PDF)
      const sortedYPositions = Object.keys(lines).map(Number).sort((a, b) => b - a);
      
      // Process each line, sorting items from left to right
      sortedYPositions.forEach(y => {
        lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
        
        // Combine the text in this line
        const lineText = lines[y].map(item => item.str).join(' ');
        text += lineText + '\n';
      });
      
      return text;
    });
}

/**
 * Primary extraction using pdf-parse
 */
async function primaryExtraction(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer, {
      // Add options to improve extraction
      pagerender: renderPage
    });
    return pdfData.text || "";
  } catch (error) {
    console.warn(`Warning: Primary extraction failed: ${error.message}`);
    return "";
  }
}

/**
 * Custom render function to handle problematic PDFs
 */
function renderPage(pageData) {
  // Return the string representation of the text
  const renderOptions = {
    normalizeWhitespace: true,
    disableCombineTextItems: false
  };
  
  return pageData.getTextContent(renderOptions)
    .then(function(textContent) {
      let lastY, text = '';
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          text += item.str;
        } else {
          text += '\n' + item.str;
        }
        lastY = item.transform[5];
      }
      return text;
    });
}

/**
 * Check if the extracted text is good enough
 */
function isExtractionSuccessful(text, filePath) {
  // Check text length relative to file size as a heuristic
  const fileSize = fs.statSync(filePath).size;
  const textLength = text?.length || 0;
  
  // If text is very short relative to file size, it might be incomplete
  const ratio = textLength / fileSize;
  
  // Check for common problems
  const hasTruncatedWarnings = text?.includes("Warning:") && 
                              text?.indexOf("Warning:") > text.length - 100;
                              
  const hasCommonMarkers = text?.includes("Protocol") || 
                          text?.includes("Eligibility") || 
                          text?.includes("Treatment");
  
  // Count control characters
  const controlCharCount = (text?.match(/[\x00-\x1F\x7F-\x9F]/g) || []).length;
  const controlCharRatio = controlCharCount / textLength;
  
  // If text has too many control characters, consider it unsuccessful
  if (controlCharRatio > 0.01) {
    console.log(`High control character ratio (${controlCharRatio.toFixed(3)}), trying alternate extraction...`);
    return false;
  }
  
  return ratio > 0.01 && hasCommonMarkers && !hasTruncatedWarnings;
}

/**
 * Backup extraction method
 */
async function backupExtraction(filePath) {
  try {
    // Create a temporary file path for the extracted text
    const tempFile = path.join(__dirname, `${path.basename(filePath, '.pdf')}_extracted.txt`);
    
    // Different strategies could be implemented here:
    
    // Method 1: Try different render options
    const dataBuffer = fs.readFileSync(filePath);
    const options = {
      // Use more aggressive options
      pagerender: customRenderPage,
      max: 0,  // No page limit
      version: 'v2.0.550'
    };
    
    const pdfData = await pdfParse(dataBuffer, options);
    if (pdfData.text && pdfData.text.length > 100) {
      return pdfData.text;
    }
    
    // Method 2: Try to use external tools if available
    try {
      // Check if pdftotext is available (from poppler-utils)
      execSync('pdftotext -v', { stdio: 'ignore' });
      
      // If available, use pdftotext
      execSync(`pdftotext -layout "${filePath}" "${tempFile}"`, { stdio: 'pipe' });
      if (fs.existsSync(tempFile)) {
        const extractedText = fs.readFileSync(tempFile, 'utf8');
        fs.unlinkSync(tempFile); // Clean up
        return extractedText;
      }
    } catch (e) {
      // pdftotext not available or failed, continue with other methods
    }
    
    // Method 3: Use a simple page-by-page approach with pdf-parse
    let combinedText = '';
    const pageTexts = await extractTextByPage(filePath);
    return pageTexts.join('\n\n--- PAGE BREAK ---\n\n');
    
  } catch (error) {
    console.error(`Backup extraction failed: ${error.message}`);
    return ""; // Return empty string as last resort
  }
}

/**
 * Custom page rendering function for difficult PDFs
 */
function customRenderPage(pageData) {
  let render_options = {
    normalizeWhitespace: false,
    disableCombineTextItems: true
  };
  
  return pageData.getTextContent(render_options)
    .then(function(textContent) {
      let text = '';
      let lastY = null;
      let lastX = null;
      const lineSpacing = 1;
      
      // Sort items by vertical position (y) to ensure correct reading order
      textContent.items.sort((a, b) => {
        if (Math.abs(a.transform[5] - b.transform[5]) < lineSpacing) {
          // Same line, sort by X
          return a.transform[4] - b.transform[4];
        }
        // Different lines
        return b.transform[5] - a.transform[5];  // Note: PDF coordinates start at bottom
      });
      
      for (const item of textContent.items) {
        const x = item.transform[4];
        const y = item.transform[5];
        
        if (lastY !== null) {
          if (Math.abs(y - lastY) > lineSpacing) {
            text += '\n'; // New line
          } else if (x - lastX > item.width) {
            text += ' '; // Space within same line
          }
        }
        
        text += item.str;
        lastY = y;
        lastX = x + item.width;
      }
      
      return text;
    });
}

/**
 * Extract text page by page
 */
async function extractTextByPage(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pageTexts = [];
  
  try {
    // First get number of pages
    const data = await pdfParse(dataBuffer, { max: 1 });
    const pageCount = data.numpages || 1;
    
    // Page numbers start at 1
    const extractPromises = Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => {
      return pdfParse(dataBuffer, {
        pagerender: customRenderPage,
        max: 1,
        firstPage: pageNum
      }).then(pageData => {
        return pageData.text || "";
      }).catch(err => {
        console.warn(`Warning: Failed to extract page ${pageNum}: ${err.message}`);
        return "";
      });
    });
    
    const results = await Promise.all(extractPromises);
    pageTexts.push(...results);
  } catch (error) {
    console.error(`Error in page-by-page extraction: ${error.message}`);
    
    // Try a simpler approach as last resort
    try {
      const simplePdfData = await pdfParse(dataBuffer);
      if (simplePdfData.text) {
        pageTexts.push(simplePdfData.text);
      }
    } catch (finalError) {
      console.error(`All extraction methods failed: ${finalError.message}`);
    }
  }
  
  return pageTexts;
}

/**
 * Sanitize text by removing problematic characters
 */
function sanitizeText(text) {
  if (!text) return "";
  
  return text
    .replace(/\0/g, '') // Remove null characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/(?:\n\s*){3,}/g, '\n\n') // Remove excessive empty lines
    .trim();
}

// If run directly, test on a file
if (process.argv[2]) {
  const testFile = process.argv[2];
  extractTextFromPDF(testFile)
    .then(text => {
      const outputFile = `${path.basename(testFile, '.pdf')}_robust.txt`;
      fs.writeFileSync(outputFile, text);
      console.log(`Extracted text saved to ${outputFile}`);
      console.log(`Text length: ${text.length} characters`);
      console.log('\nFirst 500 characters:');
      console.log(text.substring(0, 500));
    })
    .catch(console.error);
}
