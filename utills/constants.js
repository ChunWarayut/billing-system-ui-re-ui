const menuItems = [
    {
      icon: 'mdi-star',
      text: 'Payment Receive',
      to: '/paymentreceive',
      permission: "RECEIVE_PAYMENT_READ"
    },
    {
      icon: 'mdi-email-open',
      text: 'Role',
      to: '/role',
      permission: "ROLE_READ" 
    },
    {
      icon: 'mdi-email-open',
      text: 'User Management',
      to: '/user',
      permission: "USER_READ"
    },
]

module.exports = {
    menuItems
};