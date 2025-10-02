
import pdfParse from 'pdf-parse';

interface ExtractedDetails {
  name: string;
  email: string;
}


/**
 * Extracts the first name and email address from a PDF file.
 * 
 * @param filePath - The path to the PDF file to be processed.
 @returns A promise that resolves to an object containing:
 *  - `name`: Extracted full name (or empty string if not found)
 *  - `email`: Extracted email address (or empty string if not found)
 * 
 **/

const extractDetailsFromPDF = async (fileBuffer:Buffer): Promise<ExtractedDetails> => {

  const data = await pdfParse(fileBuffer);
  const text = data.text;

  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) || [];
  const names = text.match(/[A-Z][a-z]+\s[A-Z][a-z]+/g) || [];
  
  

  return {
    name: names[0] || '',
    email: emails[0] || '',
  };
};

export default extractDetailsFromPDF;
