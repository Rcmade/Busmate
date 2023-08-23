
export const authSignupReducer = (state, action) => {
  switch (action.type) {
    case 'SET_OTP_SENT':
      return {...state, isOtpSend: action.payload};
    case 'SET_EMAIL_VERIFIED':
      return {...state, isEmailVarified: action.payload};
    case 'SET_INPUT_VALUE':
      return {...state, inputValue: {...state.inputValue, ...action.payload}};
    case 'SET_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_BARCODE':
      return {...state, isBarcode: action.payload};
    case 'SET_SELFIE':
      return {...state, isSelfie: action.payload};
    case 'SET_BARCODE_DATA':
      return {...state, barcodeData: action.payload};
    case 'SET_SHOW_MODAL':
      return {...state, showModal: action.payload};
    default:
      return state;
  }
};



