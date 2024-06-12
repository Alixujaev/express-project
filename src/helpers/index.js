import moment from "moment"

export default {
  ifequal(a, b, options){
    if(a == b){
      return options.fn(this)
    }else{
      return options.inverse(this)
    }
  },

  formatDate(date){
    return moment(date).format("MMMM Do YYYY")
  }
}