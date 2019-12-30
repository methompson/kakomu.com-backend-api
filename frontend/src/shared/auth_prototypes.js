// This function simply checks whether we have authorization information
// contained in the store. Returns true if it has required information
// returns false otherwise.

function $checkAuthData(){
  const state = this.$store.state;
  if (  'authPayload' in state
    &&  'exp' in state.authPayload
  ) {
    return true;
  }
  return false;
}

async function $checkAuthAndRedirect(path = '/'){
  if (!this.$checkAuthData()){
    return this.$router.replace({
      path,
    });
  }
  return true;
}

export {
  $checkAuthData,
  $checkAuthAndRedirect
};