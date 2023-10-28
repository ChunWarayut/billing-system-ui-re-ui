export default {
  SET_PAYMENT_RECEIVE_LIST(state, pr) {
    state.paymentReceiveList = pr;
  },
  SET_CURRENT_STEP(state, step) {
    state.currentStep = step;
  },
  SET_SELECTED_PAYMENT_RECEIVE_FIRST(state, pr) {
    pr.forEach(element => {
      element.cash = false
      element.transfer = false
      element.check = false
      element.creditcard = false
      element.cashamount = undefined
      element.transferamont = undefined
      element.checkamont = undefined
      element.creditcardamont = undefined
      element.files = null
    });
    state.selectedPaymentReceive = pr;
  },
  SET_SELECTED_PAYMENT_RECEIVE(state, pr) {
    state.selectedPaymentReceive = pr;
  },
  SET_SUMMARY_DATA(state, data) {
    state.summaryData = data;
  },
  SET_LATITUDE(state, step) {
    state.latitude = step;
  },
  SET_LONGTITUDE(state, step) {
    state.longitude = step;
  },
  SET_RECEIVE_DATA(state, data) {
    state.receiveCash = data.receiveCash
    state.receiveCheck = data.receiveCheck
    state.receiveTransfer = data.receiveTransfer
    state.receiveCreditcard = data.receiveCreditcard
    state.receiveCashBank = data.receiveCashBank
    state.receiveTransferBank = data.receiveTransferBank
    state.receiveCheckBank = data.receiveCheckBank
    state.checkdate = data.checkdate
    state.checkno = data.checkno
  },
  SET_ATTACHMENT_FILES(state, data) {
    state.cashFiles = data.cashFiles || []
    state.checkFiles = data.checkFiles || []
    state.transferFiles = data.transferFiles || []
    state.creditCardFiles = data.creditCardFiles || []
  },
};
