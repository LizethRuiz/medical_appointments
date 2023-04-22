/** Function to get a status and message, is used in controllers to manage responses */
const getResponse = (response) => {
  let status = response.message.split(',')[1];
  let message = response.message.split(',')[0];
  let messageDetail = message.split(':');
  message = messageDetail.length > 1 ? messageDetail[1] : message;

  status = status ? parseInt(status) : 500;
  message = message ? message.trim() : response.message.trim();

  return { status, message };
};

/** Function receive the status and message and makes the shipment*/
const httpResponse = (status, message, res) => {
  let response =
    status != 400 && status != 401 && status != 404 && status != 500
      ? message
      : { errors: message };

  res.status(status).send(response);
};

export { getResponse, httpResponse };
