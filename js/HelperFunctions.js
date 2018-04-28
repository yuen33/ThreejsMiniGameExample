module.exports = {
  getSinusoidalResult: getSinusoidalResult
}

function getSinusoidalResult(A, t, T, C=0){
  let result;
  if(A > 0){
    result = A * Math.cos(2 * Math.PI / T * t - Math.PI) + A + C;
  }else{
    result = - A * Math.cos(2 * Math.PI / T * t) + A + C;
  }
  return result;
}