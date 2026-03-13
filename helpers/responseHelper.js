const handleSuccess = (res, data) => {
  return res.status(201).send({
    result: true,
    message: "Success",
    payload: data,
  });
};

const handleError = (res, err, payload = null) => {
  return res.status(500).send({
    result: false,
    message: err?.message || null,
    payload: payload,
  });
};

const handleOK = (res, status = 200, message = "Success") => {
  return res.status(status).send({ result: true, message: message });
};

module.exports = {
  handleSuccess,
  handleError,
  handleOK,
};
