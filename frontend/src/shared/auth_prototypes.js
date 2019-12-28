function $loggedIn(){
  const state = this.$store.state;
  if (  'authPayload' in state
    &&  'exp' in state.authPayload
  ) {
    console.log(state.exp);
    return true;
  }

  return false;
}

export {
  $loggedIn,
};