"use strict";

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// const CLIENT_ID = '195929321633-t1qn68d5uvhn3je500m6e7d5u9p0g85872o.apps.googleusercontent.com'
// const CLIENT_SECRET = '2hVITvWUPWHbXCVkqkecYP8l'
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
// const REFRESH_TOKEN = '1//04__sYkk4VFfhCgYIARAAGAQSNwF-L9IreIu1AhukAVE_mE9M2cHBOLz612dpzFtCd5D6J1F5uUvL-zlF93VOP7_TdK3Vt3F-iVQ'

const CLIENT_ID = '61411285578-j05baec6e18b95vpdlc8h1r3vmgesn9b.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developerrs.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04BaMDs61vk-sCgYIARAAGAQSNwF-L9IrQtXZjdbqiO_lW9hAwqRbx_DpXl0_08tagb29qqpuKWjlOf8H0rM8b_YiCF5_BamqRXA'

require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

this.sendMailNotification = ({
  link = "",
  quantity = 0,
  currency = "$",
  totalAmount = 0,
  referenceId = 0,
  event = "",
  eventId = "",
  email,
}) => {
  const defineQrRoute = () => {
    switch (eventId) {
      case "iZ69cNIF1WCX7caNapxP":
        return "CCS";
      case "AAqvfZZ0KVov3JcPZshy":
        return "BARQ";
      default:
        return eventId;
    }
  };

  let ACCESSTOKE = oAuth2Client.getAccessToken();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "globalboletosvzla@gmail.com",
      pass: "GENERAMOSentrEtenimientoEnEl2022#",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESSTOKE,
    },
  });

  let mail_options = {
    from: "Pabs",
    to: email,
    subject: `GLOBALBOLETOS TICKETS`,
    html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <!--[if gte mso 9]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG />
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        <![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!--<![endif]-->
        <title></title> 
    
        <style type="text/css">
          @media only screen and (min-width: 570px) {
            .u-row {
              width: 550px !important;
            }
            .u-row .u-col {
              vertical-align: top;
            }
    
            .u-row .u-col-24p79 {
              width: 136.345px !important;
            }
    
            .u-row .u-col-25 {
              width: 137.5px !important;
            }
    
            .u-row .u-col-33p33 {
              width: 183.315px !important;
            }
    
            .u-row .u-col-41p88 {
              width: 230.34px !important;
            }
    
            .u-row .u-col-100 {
              width: 550px !important;
            }
          }
    
          @media (max-width: 570px) {
            .u-row-container {
              max-width: 100% !important;
              padding-left: 0px !important;
              padding-right: 0px !important;
            }
            .u-row .u-col {
              min-width: 320px !important;
              max-width: 100% !important;
              display: block !important;
            }
            .u-row {
              width: calc(100% - 40px) !important;
            }
            .u-col {
              width: 100% !important;
            }
            .u-col > div {
              margin: 0 auto;
            }
          }
          body {
            margin: 0;
            padding: 0;
          }
    
          table,
          tr,
          td {
            vertical-align: top;
            border-collapse: collapse;
          }
    
          p {
            margin: 0;
          }
    
          .ie-container table,
          .mso-container table {
            table-layout: fixed;
          }
    
          * {
            line-height: inherit;
          }
    
          a[x-apple-data-detectors="true"] {
            color: inherit !important;
            text-decoration: none !important;
          }
    
          @media (max-width: 480px) {
            .hide-mobile {
              max-height: 0px;
              overflow: hidden;
              display: none !important;
            }
          }
          table,
          td {
            color: #000000;
          }
          a {
            color: #0000ee;
            text-decoration: underline;
          }
          @media (max-width: 480px) {
            #u_content_text_4 .v-container-padding-padding {
              padding: 15px 10px 10px !important;
            }
            #u_content_text_2 .v-container-padding-padding {
              padding: 10px 10px 15px !important;
            }
            #u_content_text_17 .v-container-padding-padding {
              padding: 10px !important;
            }
            #u_content_text_17 .v-text-align {
              text-align: center !important;
            }
            #u_content_text_5 .v-container-padding-padding {
              padding: 10px 10px 20px !important;
            }
          }
        </style>
    
        <!--[if !mso]><!-->
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <!--<![endif]-->
      </head>
    
      <body
        class="clean-body u_body"
        style="
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          background-color: #ffffff;
          color: #000000;
        "
      >
        <!--[if IE]><div class="ie-container"><![endif]-->
        <!--[if mso]><div class="mso-container"><![endif]-->
        <table
          style="
            border-collapse: collapse;
            table-layout: fixed;
            border-spacing: 0;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            vertical-align: top;
            min-width: 320px;
            margin: 0 auto;
            background-color: #ffffff;
            width: 100%;
          "
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr style="vertical-align: top">
              <td
                style="
                  word-break: break-word;
                  border-collapse: collapse !important;
                  vertical-align: top;
                "
              >
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: transparent;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: transparent;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 550px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div style="width: 100% !important">
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 20px 10px 15px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      width="100%"
                                      cellpadding="0"
                                      cellspacing="0"
                                      border="0"
                                    >
                                      <tr>
                                        <td
                                          class="v-text-align"
                                          style="
                                            padding-right: 0px;
                                            padding-left: 0px;
                                          "
                                          align="center"
                                        >
                                          <img
                                            align="center"
                                            border="0"
                                            src="https://firebasestorage.googleapis.com/v0/b/globalboletos.appspot.com/o/recursos%2Fimage-5.jpeg?alt=media&token=6d069eef-143e-4219-8a4e-4acd26757ac9"
                                            alt="Logo"
                                            title="Logo"
                                            style="
                                              outline: none;
                                              text-decoration: none;
                                              -ms-interpolation-mode: bicubic;
                                              clear: both;
                                              display: inline-block !important;
                                              border: none;
                                              height: auto;
                                              float: none;
                                              width: 58%;
                                              max-width: 307.4px;
                                            "
                                            width="307.4"
                                          />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: #eccafa;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #eccafa;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="550" style="background-color: #ffffff;width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 550px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #ffffff; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 20px 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      width="100%"
                                      cellpadding="0"
                                      cellspacing="0"
                                      border="0"
                                    >
                                      <tr>
                                        <td
                                          class="v-text-align"
                                          style="
                                            padding-right: 0px;
                                            padding-left: 0px;
                                          "
                                          align="center"
                                        >
                                          <img
                                            align="center"
                                            border="0"
                                            src="https://firebasestorage.googleapis.com/v0/b/globalboletos.appspot.com/o/recursos%2FEDITABLE_post_VALENCIA%20(1).png?alt=media&token=585a7946-a2e2-4b0e-b75b-4f9e9a545091"
                                            alt="Invoice Banner"
                                            title="Invoice Banner"
                                            style="
                                              outline: none;
                                              text-decoration: none;
                                              -ms-interpolation-mode: bicubic;
                                              clear: both;
                                              display: inline-block !important;
                                              border: none;
                                              height: auto;
                                              float: none;
                                              width: 52%;
                                              max-width: 275.6px;
                                            "
                                            width="275.6"
                                          />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: #f5dcfc;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #f5dcfc;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="550" style="background-color: #ffffff;width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 550px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #ffffff; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 20px 10px 0px 15px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <h1
                                      class="v-text-align"
                                      style="
                                        margin: 0px;
                                        color: #272e79;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                        font-weight: normal;
                                        font-family: 'Raleway', sans-serif;
                                        font-size: 22px;
                                      "
                                    >
                                      <strong
                                        >
                                        
                                        </strong
                                      >
                                    </h1>
                                    <div
                                    style="
                                    text-align: center;
                                    margin-top: 18px;
                                    "
                                    >
                                    <a
                                    href="https://global-boletos-static-nextjs-page.vercel.app/GetTicketERDAV${defineQrRoute()}/${link}"
                                    title="generar Qr"
                                    target="_blank"
                                    style= "
                                    margin: 0px;
                                    color: #272e79;
                                    line-height: 140%;
                                    background: #9e74e9;
                                    padding: 10px;
                                    border-radius: 19px;
                                    font-size: 9px;
                                    text-align: center;
                                    text-decoration: none;
                                    text-transform: uppercase;
                                    word-wrap: break-word;
                                    text-align: center;
                                    font-weight: normal;
                                    font-family: 'Raleway',sans-serif;
                                    font-size: 15px;
                                    "
                                    >
                                      Generar Qr
                                  </a>
                                    </div>

                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 20px 10px 12px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #2c3581;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong>RECUENTO</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: #eccafa;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #eccafa;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              id="u_content_text_4"
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong>Producto</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong>Descripci&oacute;n<br /></strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong>Cantidad</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              id="u_content_text_2"
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong>Total</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: #ffffff"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: #9e74e9;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #9e74e9;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong>Ticket</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              class="hide-mobile"
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      height="0px"
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        border-spacing: 0;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        vertical-align: top;
                                        border-top: 0px solid #bbbbbb;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      "
                                    >
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td
                                            style="
                                              word-break: break-word;
                                              border-collapse: collapse !important;
                                              vertical-align: top;
                                              font-size: 0px;
                                              line-height: 0px;
                                              mso-line-height-rule: exactly;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                            "
                                          >
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 0px 10px 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong
                                          ><span
                                            style="
                                              font-size: 12px;
                                              line-height: 16.8px;
                                            "
                                            >Boleto para el amanecer vallenato</span
                                          ></strong
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              class="hide-mobile"
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      height="0px"
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        border-spacing: 0;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        vertical-align: top;
                                        border-top: 0px solid #bbbbbb;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      "
                                    >
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td
                                            style="
                                              word-break: break-word;
                                              border-collapse: collapse !important;
                                              vertical-align: top;
                                              font-size: 0px;
                                              line-height: 0px;
                                              mso-line-height-rule: exactly;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                            "
                                          >
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 0px 10px 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <span
                                          style="
                                            font-size: 18px;
                                            line-height: 25.2px;
                                          "
                                          >
                                          ${quantity}
                                          </span
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="138" style="background-color: #9e74e9;width: 138px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-25"
                        style="
                          max-width: 320px;
                          min-width: 138px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              class="hide-mobile"
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      height="0px"
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        border-spacing: 0;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        vertical-align: top;
                                        border-top: 0px solid #bbbbbb;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      "
                                    >
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td
                                            style="
                                              word-break: break-word;
                                              border-collapse: collapse !important;
                                              vertical-align: top;
                                              font-size: 0px;
                                              line-height: 0px;
                                              mso-line-height-rule: exactly;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                            "
                                          >
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 0px 10px 20px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <span
                                          style="
                                            font-size: 18px;
                                            line-height: 25.2px;
                                          "
                                          >${currency} ${totalAmount}</span
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: #ffffff"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: #ffffff;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #ffffff;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="183" style="background-color: #ffffff;width: 183px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-33p33"
                        style="
                          max-width: 320px;
                          min-width: 183px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #ffffff; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      height="0px"
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        border-spacing: 0;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        vertical-align: top;
                                        border-top: 0px solid #bbbbbb;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      "
                                    >
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td
                                            style="
                                              word-break: break-word;
                                              border-collapse: collapse !important;
                                              vertical-align: top;
                                              font-size: 0px;
                                              line-height: 0px;
                                              mso-line-height-rule: exactly;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                            "
                                          >
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="230" style="background-color: #ffffff;width: 230px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-41p88"
                        style="
                          max-width: 320px;
                          min-width: 230px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #ffffff; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              id="u_content_text_17"
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px 0px 10px 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #2c3581;
                                        line-height: 140%;
                                        text-align: right;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <span
                                          style="
                                            font-size: 18px;
                                            line-height: 25.2px;
                                          "
                                          ><strong
                                            >N&uacute;mero de factura :</strong
                                          ></span
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="136" style="background-color: #ffffff;width: 136px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-24p79"
                        style="
                          max-width: 320px;
                          min-width: 136px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #ffffff; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              id="u_content_text_5"
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #2c3581;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <strong
                                          ><span
                                            style="
                                              font-size: 20px;
                                              line-height: 28px;
                                              font-family: 'Open Sans', sans-serif;
                                            "
                                            >${referenceId}</span
                                          ></strong
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: #f5dcfc;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #f5dcfc;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="550" style="background-color: #9e74e9;width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 550px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="background-color: #9e74e9; width: 100% !important"
                        >
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 15px 10px 10px 15px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 150%;
                                        text-align: left;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 150%">
                                        <strong
                                          ><span
                                            style="
                                              font-family: Lato, sans-serif;
                                              font-size: 16px;
                                              line-height: 24px;
                                            "
                                            >
                                          </span></strong
                                        ><strong
                                          >Debes presentar tu documento o
                                          c&eacute;dula de identidad VIGENTE para
                                          comprobar tu autenticidad y as&iacute;
                                          poder canjear tus entradas.</strong
                                        >
                                      </p>
                                      <p style="font-size: 14px; line-height: 150%">
                                        &nbsp;
                                      </p>
                                      <p style="font-size: 14px; line-height: 150%">
                                        <strong
                                          >Para esto, debes dirigirte el d&iacute;a
                                          del evento a las taquillas seleccionadas y
                                          presentar tu tel&eacute;fono inteligente
                                          con el c&oacute;digo suministrado.</strong
                                        >
                                      </p>
                                      <p style="font-size: 14px; line-height: 150%">
                                        &nbsp;
                                      </p>
                                      <p style="font-size: 14px; line-height: 150%">
                                        <strong
                                          >(No habr&aacute; venta ni canje de
                                          entradas para ni&ntilde;os)
                                        </strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 15px 10px 30px 15px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #f1f1f1;
                                        line-height: 150%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 150%">
                                        <strong
                                          ><span
                                            style="
                                              font-size: 16px;
                                              line-height: 24px;
                                            "
                                            >Atentamente,</span
                                          ></strong
                                        >
                                      </p>
                                      <p style="line-height: 150%; font-size: 14px">
                                        <strong
                                          ><span
                                            style="
                                              font-size: 16px;
                                              line-height: 24px;
                                            "
                                            >Global Boletos</span
                                          ></strong
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: transparent;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: transparent;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 550px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div style="width: 100% !important">
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      height="0px"
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        border-spacing: 0;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        vertical-align: top;
                                        border-top: 0px solid #bbbbbb;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      "
                                    >
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td
                                            style="
                                              word-break: break-word;
                                              border-collapse: collapse !important;
                                              vertical-align: top;
                                              font-size: 0px;
                                              line-height: 0px;
                                              mso-line-height-rule: exactly;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                            "
                                          >
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 550px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: #1f2060;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        background-color: transparent;
                      "
                    >
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #1f2060;"><![endif]-->
    
                      <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 550px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div style="width: 100% !important">
                          <!--[if (!mso)&(!IE)]><!--><div
                            style="
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          ><!--<![endif]-->
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 35px 10px 10px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div align="center">
                                      <div style="display: table; max-width: 128px">
                                        <!--[if (mso)|(IE)]><table width="128" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:128px;"><tr><![endif]-->
    
                                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 11px;" valign="top"><![endif]-->
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 11px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                "
                                              >
                                                <a
                                                  href="https://www.facebook.com/livevipmusic/posts/2055255514633889?comment_id=2055570927935681&notif_id=1650334539799835&notif_t=feed_comment&ref=notif"
                                                  title="Facebook"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="https://firebasestorage.googleapis.com/v0/b/globalboletos.appspot.com/o/recursos%2Fimage-1.png?alt=media&token=c8fed56f-9cb5-4c3c-8211-08e915a90439"
                                                    alt="Facebook"
                                                    title="Facebook"
                                                    width="32"
                                                    style="
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                      clear: both;
                                                      display: block !important;
                                                      border: none;
                                                      height: auto;
                                                      float: none;
                                                      max-width: 32px !important;
                                                    "
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
    
                                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 11px;" valign="top"><![endif]-->
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 11px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                "
                                              >
                                                <a
                                                  href="https://twitter.com/globalboletos"
                                                  title="Twitter"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="https://firebasestorage.googleapis.com/v0/b/globalboletos.appspot.com/o/recursos%2Fimage-2.png?alt=media&token=8305d34c-32f5-4d5c-8ec2-730f4ed05fb0"
                                                    alt="Twitter"
                                                    title="Twitter"
                                                    width="32"
                                                    style="
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                      clear: both;
                                                      display: block !important;
                                                      border: none;
                                                      height: auto;
                                                      float: none;
                                                      max-width: 32px !important;
                                                    "
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
    
                                        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 0px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                "
                                              >
                                                <a
                                                  href="https://www.instagram.com/globalboletos/"
                                                  title="Instagram"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src="https://firebasestorage.googleapis.com/v0/b/globalboletos.appspot.com/o/recursos%2Fimage-3.png?alt=media&token=59c687f8-b03c-4a45-b74d-7601376a5708"
                                                    alt="Instagram"
                                                    title="Instagram"
                                                    width="32"
                                                    style="
                                                      outline: none;
                                                      text-decoration: none;
                                                      -ms-interpolation-mode: bicubic;
                                                      clear: both;
                                                      display: block !important;
                                                      border: none;
                                                      height: auto;
                                                      float: none;
                                                      max-width: 32px !important;
                                                    "
                                                  />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
    
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Raleway', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px 30px 15px;
                                      font-family: 'Raleway', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #ffffff;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        <span
                                          style="
                                            font-size: 12px;
                                            line-height: 16.8px;
                                          "
                                          >&copy; Copyright 2022, Global Boletos,
                                          todos los derechos reservados.</span
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
    
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        <!--[if mso]></div><![endif]-->
        <!--[if IE]></div><![endif]-->
      </body>
    </html>
        `,
  };

  transporter.sendMail(mail_options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Mail send success" + info.response);
    }
  });
};
module.exports = this;
