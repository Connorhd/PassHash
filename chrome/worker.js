importScripts('js/core-min.js','js/hmac-min.js','js/sha256-min.js','js/pbkdf2-min.js');

// orion elenzil
// 20080905
 
function getValueOfDigit(digit, alphabet)
{
   var pos = alphabet.indexOf(digit);
   return pos;
}
 
function convert(src, srcAlphabet, dstAlphabet)
{
   var srcBase = srcAlphabet.length;
   var dstBase = dstAlphabet.length;
 
   var wet     = src;
   var val     = 0;
   var mlt     = 1;
 
   while (wet.length > 0)
   {
	 var digit  = wet.charAt(wet.length - 1);
	 val       += mlt * getValueOfDigit(digit, srcAlphabet);
	 wet        = wet.substring(0, wet.length - 1);
	 mlt       *= srcBase;
   }
 
   wet          = val;
   var ret      = "";
 
   while (wet >= dstBase)
   {
	 var digitVal = wet % dstBase;
	 var digit    = dstAlphabet.charAt(digitVal);
	 ret          = digit + ret;
	 wet /= dstBase;
   }
 
   var digit    = dstAlphabet.charAt(wet);
   ret          = digit + ret;
   
   return ret;
}

self.onmessage = function(e) {  
	var hash = CryptoJS.PBKDF2(e.data.master, e.data.salt, { keySize: 256/32, iterations: 1000, hasher: CryptoJS.algo.SHA256 }).toString();
	var fullpass = convert(hash,"0123456789abcdef","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	var pass = "";
	var chars = 0;
	for (i = 0; chars < 12; i++) {
		j = i % 12;
		if (chars == 0 && fullpass.substring(j,j+1).toUpperCase() != fullpass.substring(j,j+1)) {
			pass += fullpass.substring(j,j+1);
			chars++;
		} else if (chars == 1 && parseInt(fullpass.substring(j,j+1)) == fullpass.substring(j,j+1)) {
			pass += fullpass.substring(j,j+1);
			chars++;	
		} else if (chars == 2 && fullpass.substring(j,j+1).toLowerCase() != fullpass.substring(j,j+1)) {
			pass += fullpass.substring(j,j+1);
			chars++;
		} else if (chars > 2) {
			pass += fullpass.substring(j,j+1);
			chars++;						
		} else if (chars == 0 && i >= fullpass.length) {
			pass += "f";
			chars++
		} else if (chars == 1 && i >= fullpass.length*2) {
			pass += "7";
			chars++
		} else if (chars == 2 && i >= fullpass.length*3) {
			pass += "T";
			chars++
		}
	}
	self.postMessage(pass);
};  