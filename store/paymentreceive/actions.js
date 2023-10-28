export default {
  async getPaymentReceiveList({ commit }, { searchText } ) {
    try {
      const res = await this.$axios({
        method: 'get',
        url: `/paymentreceives?q=${searchText || ''}`
      })
      if(res && res.data){
        commit("SET_PAYMENT_RECEIVE_LIST", res.data);
      }
    } catch (error) {
      throw error
    }
  },
  async savePaymentReceive({ commit, state }, data ) {
    try {
      const payload = new FormData();
      const pr = data.pr
      let prData = []
      pr.forEach(item => {
        prData.push({
          custID: item.CustID && item.CustID.toString(),
          saleAreaID: item.SaleAreaID && item.SaleAreaID.toString(),
          custCode: item.CustCode,
          custName: item.CustName,
          creditDays: item.CreditDays,
          custAddr1: item.CustAddr1,
          district: item.District,
          amphur: item.Amphur,
          province: item.Province,
          remaamnt: item.remaamnt,
          comp: item.CompCode,
          latitude: state.latitude,
          longitude: state.longitude,
          cashamount: item.cashamount && Number(item.cashamount) || 0,
          transferamont: item.transferamont && Number(item.transferamont) || 0,
          checkamont: item.checkamont && Number(item.checkamont)|| 0,
          creditcardamont: item.creditcardamont && Number(item.creditcardamont) || 0,
          excutedInvoice: item.excutedInvoice,
          cashamountbankbookid: state.receiveCashBank || null,
          transferamontbankbookid: state.receiveTransferBank || null,
          checkamountbankbookid: state.receiveCheckBank || null,
          checkdate: state.checkdate || null,
          checkno: state.checkno || null,
        })
        
      });
      payload.append(`paymentDetails`, JSON.stringify(prData));
      if(state.cashFiles && state.cashFiles.length > 0){
        for (let file of state.cashFiles) {
          payload.append('cashFiles', file)
        }
      }
      if(state.checkFiles && state.checkFiles.length > 0){
        for (let file of state.checkFiles) {
          payload.append('checkFiles', file)
        }
      }
      if(state.transferFiles && state.transferFiles.length > 0){
        for (let file of state.transferFiles) {
          payload.append('transferFiles', file)
        }
      }
      if(state.creditCardFiles && state.creditCardFiles.length > 0){
        for (let file of state.creditCardFiles) {
          payload.append('creditCardFiles', file)
        }
      }
      try {
        let response = await this.$axios.post('/paymentreceives', payload, { headers: {
          'Content-Type': 'multipart/form-data'
        }})
        if(response && response.data){
          commit("SET_SUMMARY_DATA", response.data);
        }
      } catch (error) {
        throw new error
      }
    } catch (error) {
      throw error
    }
  },
  async executeInvoice({ commit }, data ) {
    try {
      let paySummary = Number(data.cashamount || 0) + Number(data.transferamont|| 0 )+ Number(data.checkamont|| 0) + Number(data.creditcardamont|| 0)
      const res = await this.$axios({
        method: 'post',
        url: `/executeinvoice`,
        data: {
          custCode: data.CustCode,
          compcode: data.CompCode,
          amount: paySummary
        }
      })
      if(res && res.data){
        return res.data
      }
    } catch (error) {
      throw error
    }
  },
};
