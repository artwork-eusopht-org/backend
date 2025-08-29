

module.exports = {

  offerAccept: (name,amount,url, artwork_title) => {
    return `
    
    <!DOCTYPE html>
      
      <html lang="en">
      
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 95%;}
            }
            @media only screen and (min-width: 601px) {
              .container { width: 50%; }
            }
          </style>
        </head>
      
        <body style='background-color:#fafaf5;padding-top:5px'>
          
          <div style='display:flex;border-radius:10px;padding:10px;height:max-content;'>
            <div class='container' style='background-color:white;margin-left:auto;margin-right:auto;border-radius:10px;padding:10px;height:max-content;'>
              <div>
                <p><strong>Hello ${name},</strong></p>
                <p>Thank you for your offer on ${artwork_title}. We’re pleased to let you know that your offer of AUD ${amount} has been accepted</p>
                <p>To finalise your purchase, please complete your payment securely using the link below:</p>
                <p><a href="${url}">Click here to complete your payment</a></p>
                <p>Once payment is received, the artwork will be marked as <span style="font-weight:bold;">Sold</span> and reserved for you.</p>
              </div>
              <div>
                <p style="margin: 0; line-height: 1.2;">Kind regards,</p>
                <p style="margin: 0; line-height: 1.2;">The Essence of Joy Exhibition Team</p>
                <p style="margin: 0; line-height: 1.2;">Judy Woods</p>
              </div>
              
              </div>
      
             </div>
          </body>
      `
  },

  offerReject: (name,amount, artwork_title) => {
    return `
    
    <!DOCTYPE html>
      
      <html lang="en">
      
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 95%;}
            }
            @media only screen and (min-width: 601px) {
              .container { width: 50%; }
            }
          </style>
        </head>
      
        <body style='background-color:#fafaf5;padding-top:5px'>
          
          <div style='display:flex;border-radius:10px;padding:10px;height:max-content;'>
            <div class='container' style='background-color:white;margin-left:auto;margin-right:auto;border-radius:10px;padding:10px;height:max-content;'>
              <div>
                <p><strong>Hello ${name},</strong></p>
                <p>Thank you for your offer on ${artwork_title}. I appreciate your interest in my work. Unfortunately, I am unable to accept the offer at this amount.</p>
                <p>If you would like to consider submitting a revised offer, I’d be happy to consider it.</p>
              </div>
              
              <div>
                <p style="margin: 0; line-height: 1.2;">Kind regards,</p>
                <p style="margin: 0; line-height: 1.2;">The Essence of Joy Exhibition Team</p>
                <p style="margin: 0; line-height: 1.2;">Judy Woods</p>
              </div>
              
              </div>
             </div>
          </body>
      `
  },

  offerRecieved: (name,amount) => {
    return `
    
    <!DOCTYPE html>
      
      <html lang="en">
      
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 95%;}
            }
            @media only screen and (min-width: 601px) {
              .container { width: 50%; }
            }
          </style>
        </head>
      
        <body style='background-color:#fafaf5;padding-top:5px'>
          
          <div style='display:flex;border-radius:10px;padding:10px;height:max-content;'>
            <div class='container' style='background-color:white;margin-left:auto;margin-right:auto;border-radius:10px;padding:10px;height:max-content;'>
              <div style='text-align:center'>
                ExhibitPro
              </div>
              <div>
                <p><strong>Hi,</strong></p>
                <p>Your have received an offer of AUD${amount} from ${name}!</p>
              </div>
              
              <div>
                <p style="margin: 0; line-height: 1.2;">Kind regards,</p>
                <p style="margin: 0; line-height: 1.2;">The Essence of Joy Exhibition Team</p>
                <p style="margin: 0; line-height: 1.2;">Judy Woods</p>
              </div>
              
              </div>
      
             </div>
          </body>
      `
  },
}