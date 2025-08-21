

module.exports = {

  offerAccept: (name,amount,url) => {
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
                <p><strong>Hi ${name},</strong></p>
                <p>Your offer is accepted please pay the amount AUD${amount} on below URL!</p>
                <p><a href="${url}">Click here to complete your payment</a></p>
              </div>
              
              <div>
                <p>Warm Regards,</p>
              </div>
              <div>
                <p>The ExhibitPro Team</p>
              </div>
              
              </div>
      
             </div>
          </body>
      `
  },

  offerReject: (name,amount) => {
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
                <p><strong>Hi ${name},</strong></p>
                <p>Your offer AUD${amount} is rejected!</p>
              </div>
              
              <div>
                <p>Warm Regards,</p>
              </div>
              <div>
                <p>The ExhibitPro Team</p>
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
                <p>Warm Regards,</p>
              </div>
              <div>
                <p>The ExhibitPro Team</p>
              </div>
              
              </div>
      
             </div>
          </body>
      `
  },
}
