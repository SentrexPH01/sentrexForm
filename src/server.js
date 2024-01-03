/* eslint-disable no-unused-vars */
import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import sgMail from '@sendgrid/mail'
import serverless from "serverless-http"
import { createProxyMiddleware } from 'http-proxy-middleware';

// Import and configure dotenv
import dotenv from 'dotenv';
dotenv.config()

const app = express();
// const port = 3001;

app.use(cors());
app.use(express.json())

// eslint-disable-next-line no-undef
const sendGridApiKey = process.env.VITE_SENDGRID_API_KEY

// Set sgMail with API key
sgMail.setApiKey(sendGridApiKey); 



// Function to send email with only JSON data
const sendEmailWithJsonData = async (recipientEmail, jsonData) => {
  try {
    const senderEmail = 'itautomation@sentrex.com';

    const msg = {
      to: recipientEmail,
      from: senderEmail,
      subject: 'New Form Submission',
      text: JSON.stringify(jsonData, null, 2),
    };

    await sgMail.send(msg)

    console.log('Email with JSON data sent successfully!');
  } catch (error) {
    console.error('Error sending email with JSON data:', error);

    // Log additional details about the error
    console.error('SendGrid response:', error.response);
    console.error('SendGrid request payload:', error.request);

    throw new Error('Error sending email with JSON data');
  }
};


// Function to convert a data URL to a buffer
const dataUrlToBuffer = (dataUrl) => {
  const base64 = dataUrl.split(',')[1];
  return {
    // eslint-disable-next-line no-undef
    buffer: Buffer.from(base64, 'base64'),
    mimeType: dataUrl.split(';')[0].split(':')[1],
  };
};

const currentDate = new Date()
console.log(currentDate);


let globalIAm = '';

let globalDoctor = '';

// app.post('/send-iam-data', async (req, res) => {
//   try {
//     globalIAm = req.body.iAm; // Store iAm globally

  
//     console.log('Received data from frontend:', globalIAm);

//     res.json({ message: 'Data received successfully!' });
//   } catch (error) {
//     console.error('Error processing send-iam-data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// })

app.post('/send-iam-data', async (req, res) => {
  try {
    const { iAm, doctor } = req.body; // Extract iAm and doctor from the request body
    globalIAm = iAm; // Store iAm globally
    globalDoctor = doctor; // Store doctor globally

    console.log('Received data from frontend:', globalIAm, globalDoctor);

    res.json({ message: 'Data received successfully!' });
  } catch (error) {
    console.error('Error processing send-iam-data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/generate-pdf', async (req, res) => {
  try {
    // Extract input data from the request body
    const { 
          firstName,
          lastName,
          healthCardNumber,
          bestTimeToCall,
          leaveAVoiceMail,
          address,
          address2,
          city,
          province,
          postalCode,
          email,
          doctor,
          medication,
          privateInsurance,
          insurerGroupContractPlan,
          insurerCertificate,
          iAm,
          dateOfBirth,
          phoneNumber,
          acknowledgedcheckbox,
          // dateOfSignature,
          
          signatureDataUrl,
          vcbFrom,
          nameOfSdmPrinted,
          relationshipOfSdmToPatient,
          vcbNameOfHcp,

    } = req.body;


  
    // Call the function to send an email with JSON data to paulh@sentrex.com
    await sendEmailWithJsonData('paulh@sentrex.com', {
      firstName,
      lastName,
      healthCardNumber,
      bestTimeToCall,
      leaveAVoiceMail,
      address,
      address2,
      city,
      province,
      postalCode,
      email,
      doctor,
      medication,
      privateInsurance,
      insurerGroupContractPlan,
      insurerCertificate,
      iAm,
      dateOfBirth,
      phoneNumber,
      acknowledgedcheckbox,
      // dateOfSignature,
      
      currentDate,
      vcbFrom,
      nameOfSdmPrinted,
      relationshipOfSdmToPatient,
      vcbNameOfHcp,
    });

    console.log('Received data on server:', { 

          firstName,
          lastName,
          healthCardNumber,
          dateOfBirth,
          phoneNumber,
          bestTimeToCall,
          leaveAVoiceMail,
          address,
          address2,
          city,
          province,
          postalCode,
          email,
          doctor,
          medication,
          privateInsurance,
          insurerGroupContractPlan,
          insurerCertificate,
          iAm,
          acknowledgedcheckbox,
          // dateOfSignature,
          
          currentDate,
          vcbFrom,
          nameOfSdmPrinted,
          relationshipOfSdmToPatient,
          vcbNameOfHcp,
    
    });


    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Navigates to the project in DEV
    // await page.goto('http://localhost:5173/');

    // Navigfate to the AWS Amplify Project
    await page.goto('https://main.d3csn0gbow9q15.amplifyapp.com/')

    
     // Wait for form
    await page.waitForSelector('.patient-form');
    await page.waitForSelector('#acknowledgedcheckbox');

  
   

    // Apply inline style for page break before using querySelectorAll
    await page.evaluate(() => {
        const pageBreakElements = document.querySelectorAll('.page-break');
        pageBreakElements.forEach((pageBreakElement) => {
        pageBreakElement.style.pageBreakBefore = 'always';
        pageBreakElement.style.marginTop = '25px'; // Adjust the margin-top value as needed
      });
    });




    await page.type('#firstName', firstName);
    await page.type('#lastName', lastName);
    await page.type('#healthCardNumber', healthCardNumber);
    await page.type('#phoneNumber', phoneNumber);
    await page.type('#address', address)
    await page.type('#address2', address2)
    await page.type('#city', city)
    await page.type('#province', province)
    await page.type('#postalCode', postalCode)
    await page.type('#email', email)
    await page.type('#privateInsurance', privateInsurance)
    await page.type('#insurerGroupContractPlan', insurerGroupContractPlan)
    await page.type('#insurerCertificate', insurerCertificate)
   
 

    for (const value of bestTimeToCall) {
      const checkbox = await page.waitForXPath(`//input[@id='${value}']`);
      await checkbox.click();
    }



    let radioButton = await page.waitForXPath(`//input[@id='${leaveAVoiceMail}']`)
    await radioButton.click();

   

    await page.select('#doctor', doctor)

    let medicationRadioButton = await page.waitForXPath(`//input[@id='${medication}']`)
    await medicationRadioButton.click();

    // for (const value of leaveAVoiceMail) {
    //   const radio = await page.waitForXPath(`//input[@id='${value}']`);
    //   await radio.click();
    // }

    // await page.click("#leaveAVoiceMail", {clickCount: 1});


    // Clicks the Acknowledged Checkbox
    await page.click('#acknowledgedcheckbox', {clickCount: 1});
    await page.select('#iAm', iAm)
    // Wait for 1 seconds
    await page.waitForTimeout(500);

    if (iAm === "HCP" || iAm === "SDM") {
      // Execute these lines only if iAm is "HCP" or "SDM"
      await page.type('#nameOfSdmPrinted', nameOfSdmPrinted);
      await page.type('#relationshipOfSdmToPatient', relationshipOfSdmToPatient);
    }
    
    if (iAm === "HCP" && vcbFrom === "Patient") {
      await page.type('#vcbNameOfHcp', vcbNameOfHcp);
      await page.click('#dummyID');
    }
    
    if (iAm === "HCP" && vcbFrom === "Patient&apos;s Subsitute Decision Maker") {
      await page.type('#vcbNameOfHcp', vcbNameOfHcp);
      await page.click('#dummyID2');
    }
    
    // await page.type('#dateOfSignature', dateOfSignature);
    
 

   // Generates a PDF from the page content with margins
   const pdfPath = 'patient-form-test.pdf';
   await page.pdf({
     path: pdfPath,
     format: 'letter',
     margin: {
       top: '15px',
       bottom: 0,
       left: '15px',
       right: '15px',
     },
   });
 
     
 
    // Add an image (signature) to the bottom of the generated PDF
    const imageDataUrl = req.body.signatureDataUrl;
    const outputPdfPath = 'patient-form-final.pdf';
    await addImageToPDF(pdfPath, imageDataUrl, outputPdfPath);
 
    // Cleanup: Delete the original PDF without the image
    await fs.unlink(pdfPath)
 
    // Send email with the generated PDF as an attachment
    const pdfBytes = await fs.readFile(outputPdfPath);
    await sendEmailWithAttachment(req.body.email, pdfBytes);
 
    await browser.close();
 
 
 
    res.json({ success: true, pdfPath: outputPdfPath });
    console.log('PDF generated and emailed successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
 
 });
 
 
 // Function to send email with attachment using SendGrid
 const sendEmailWithAttachment = async (recipientEmail, attachmentBytes) => {
   try {
     const senderEmail = 'itautomation@sentrex.com'; // Replace with your sender email
 
     const msg = {
       to: '87hendricks@gmail.com',
       from: senderEmail,
       subject: 'VHC Form',
       text: 'Please see the attachment',
       attachments: [
         {
           content: attachmentBytes.toString('base64'),
           filename: 'patient-form.pdf',
           type: 'application/pdf',
           disposition: 'attachment',
         },
       ],
     };
 
     await sgMail.send(msg);
 
     console.log('Email sent successfully!');
   } catch (error) {
     console.error('Error sending email:', error);
     throw new Error('Error sending email');
   }
 };
 
 
 
 
 // Function to add an image to a specific location on the last page of a PDF
 const addImageToPDF = async (pdfPath, imageDataUrl, outputPdfPath) => {
   try {
     const pdfBytes = await fs.readFile(pdfPath);
     const pdfDoc = await PDFDocument.load(pdfBytes);
 
     // Get the last page of the PDF
     const lastPage = pdfDoc.getPages()[pdfDoc.getPages().length - 1];
 
     const { width, height } = lastPage.getSize();
 
     const { buffer, mimeType } = dataUrlToBuffer(imageDataUrl);
     const image = await pdfDoc.embedPng(buffer);
 
     // Set the desired width and height for the image
     const desiredWidth = 490;
     const desiredHeight = 130;
 
     // Conditionally set x and y based on the value of iAm
     let x, y;
 
     console.log(globalIAm)
 
     if (globalIAm === 'HCP') {
       // Set coordinates for 'theHCP'
       x = 55; // Adjust as needed
       y = 350; // Adjust as needed
     } else {
       // Set default coordinates for other cases
       x = 55; // Adjust as needed
       y = 465; // Adjust as needed
     }
 
     console.log(`iAm: ${globalIAm}, x: ${x}, y: ${y}`); // Debugging statement
 
     lastPage.drawImage(image, { x, y, width: desiredWidth, height: desiredHeight });
 
     const modifiedPdfBytes = await pdfDoc.save();
     await fs.writeFile(outputPdfPath, modifiedPdfBytes);
   } catch (error) {
     console.error('Error in addImageToPDF:', error);
   }
 };
 
 export const handler = serverless(app);


// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
