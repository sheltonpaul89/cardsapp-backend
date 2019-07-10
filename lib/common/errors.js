module.exports = {
  PlanExists: {
    statusCode: 409,
    error: 'PlanAlreadyExists',
    message: 'A Plan with the same Duration , Cost and Allowed requests Count already exists'
  }  
  ,InvalidPlanValues: {
      statusCode: 409,
      error: 'InvalidPlanValues',
      message: 'The Duration , Cost and Allowed requests Count should be Non Negative'
    },  
    UserEmailExists: {
      statusCode: 409,
      error: 'UserEmailExists',
      message: 'User with Email "{0}" exists'
    },
    PlanNotFound:{
      statusCode: 404,
      error: 'PlanNotFound',
      message: 'Plan with Id "{0}" Not Found'
    },
    NoPlansFound:{
      statusCode: 404,
      error: 'NoPlansFound',
      message: 'No Plans and found in the System'
    },
    UserNotFound: {
      statusCode: 404,
      error: 'UserNotFound',
      message: 'User with Email "{0}" Not Found'
    },
    UserIDNotFound: {
      statusCode: 404,
      error: 'UserIDNotFound',
      message: 'User with ID "{0}" Not Found'
    },
    CardIDNotFound: {
      statusCode: 404,
      error: 'CardIDNotFound',
      message: 'Card with ID "{0}" Not Found'
    },
    CreationStatusError: {
      statusCode: 409,
      error: 'CreationStatusError',
      message: 'Request can be only created in Open Status'
    },
    CreationServicerError: {
      statusCode: 409,
      error: 'CreationServicerError',
      message: 'servicer_user_id Cannot be provided when request creation'
    },
    AcceptedUpdateError: {
      statusCode: 409,
      error: 'AcceptedUpdateError',
      message: 'Request cannot be Udated to Accepted Status'
    },
    RequestAcceptError: {
      statusCode: 409,
      error: 'RequestAcceptError',
      message: 'Only Open Requests can be Accepted'
    },
    InvalidRequest: {
      statusCode: 409,
      error: 'InvalidRequest',
      message: 'Request is invalid for the User'
    },
    RequestNotFound: {
      statusCode: 404,
      error: 'RequestNotFound',
      message: 'Request with Id "{0}" Not Found'
    },
    AddressNotFound: {
      statusCode: 404,
      error: 'AddressNotFound',
      message: 'Address with Id "{0}" Not Found'
    },
    AddressUserMismatch: {
      statusCode: 409,
      error: 'AddressUserMismatch',
      message: 'Address with Id "{0}" does not belong to the User'
    },
    CardNotFound: {
      statusCode: 404,
      error: 'CardNotFound',
      message: 'Card with Id "{0}" Not Found'
    },
    InValidID: {
      statusCode: 400,
      error: 'InvalidID',
      message: 'The Provided ID value is of wrong format'
    },
    UnhandledException: {
      statusCode: 500,
      error: 'UnhandledException',
      message: 'Sku "{0}" not found'
    }
  }