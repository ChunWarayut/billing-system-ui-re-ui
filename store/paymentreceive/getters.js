export default {
  paymentReceiveList(state) {
    return state.paymentReceiveList;
  },
  currentStep(state) {
    return state.currentStep;
  },
  selectedPaymentReceive(state) {
    return state.selectedPaymentReceive;
  },
  summaryData(state) {
    return state.summaryData;
  },
  geoLocation(state) {
    if(state.latitude && state.longitude){
      return [ state.latitude, state.longitude];
    }
    return []
    
  },
  receiveData(state) {
    return {
      receiveCash: state.receiveCash,
      receiveCheck: state.receiveCheck,
      receiveTransfer: state.receiveTransfer,
      receiveCreditcard: state.receiveCreditcard,
      receiveCashBank: state.receiveCashBank,
      receiveTransferBank: state.receiveTransferBank,
      receiveCheckBank: state.receiveCheckBank,
      checkdate: state.checkdate,
      checkno: state.checkno,
    }
  },
  attachmentData(state) {
    return {
      cashFiles: state.cashFiles,
      checkFiles: state.checkFiles,
      transferFiles: state.transferFiles,
      creditCardFiles: state.creditCardFiles,
    }
  },
}