$(document).ready(function() {
  
});

let getModel = async () => model = await tf.loadGraphModel('/model/model.json')

let doStyleTransfer = async () => {
  const model = await getModel()

  const content = $("#content")[0]
  const style = $("#style")[0]  

  const contentTensor = preprocess(content)
  const styleTensor = preprocess(style)

  console.log('model= ' + model)
  const result = model.execute([styleTensor, contentTensor])
  const canvas = document.getElementById('stylizedImage')

  tf.browser.toPixels(tf.squeeze(result), canvas)
}

let preprocess = (imgData) => {
 return tf.tidy(()=>{
  //convert the image data to a tensor 
  let tensor = tf.browser.fromPixels(imgData, numChannels= 3)
  
  // Normalize the image 
  const offset = tf.scalar(255.0);
  const normalized = tensor.div(offset);

  //We add a dimension to get a batch shape 
  const batched = normalized.expandDims(0)
  return batched
 })
}


let loadImageFile = function(event) {
  let image = document.getElementById('content');
  image.src = URL.createObjectURL(event.target.files[0]);
};

let loadStyleFile = function(event) {
  let image = document.getElementById('style');
  image.src = URL.createObjectURL(event.target.files[0]);
  doStyleTransfer()
};