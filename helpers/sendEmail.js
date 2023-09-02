const ElasticEmail = require("@elasticemail/elasticemail-client");
const client = ElasticEmail.ApiClient.instance;
const apikey = client.authentications["apikey"];
const { API_KEY } = process.env;
apikey.apiKey = API_KEY;
const emailsApi = new ElasticEmail.EmailsApi();

const callback = (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Email sent.");
  }
};

async function sendEmail(emailData) {
  emailsApi.emailsPost(emailData, callback);
}

module.exports = sendEmail;
