
  const CardBands = [
      'standard chartered platinum credit card',
      'HDFC Regalia credit card',
      'SBI credit card',
      'SBI card ELITE',
      'Other'
  ];
  const CompanyBankDetails = [{
    bank_name : 'Indian Bank',
    branch : 'Chromepet',
    account_type : 'Savings',
    account_number : '710027583',
    ifsc_code : 'IDIB000C028'
  }]

  const TextLocalURL = "https://api.textlocal.in/send/?apiKey=6Cv2DHzhi3A-Ybx7k5l9yV9B0KXzoI36DUGRwsvx57"

  const IdValueCorreptedMessage = 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters';

  module.exports = {
    CardBands,
    IdValueCorreptedMessage,
    CompanyBankDetails,
    TextLocalURL
  };
  