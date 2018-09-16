from __future__ import division
from __future__ import print_function


from flask_cors import CORS
from flask import Flask, request, render_template, json, jsonify, send_from_directory, redirect
import json
#import cv2
import numpy as np
import io


# add DLTK Dependencies -*-

import argparse
import os
import time
import pandas as pd
import tensorflow as tf
import SimpleITK as sitk
from tensorflow.contrib import predictor
from dltk.utils import sliding_window_segmentation_inference
from reader import read_fn, map_labels

from werkzeug import secure_filename






app = Flask(__name__)
CORS(app)
#May not work..........

UPLOAD_FOLDER = 'input_nii'
ALLOWED_EXTENSIONS = set(['png', 'nii'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def allowed_filename(filename):
    return '.' in filename and filename.rsplit('.',1)[1] in ALLOWED_EXTENSIONS


# DLTK specific content start


@app.route("/upload", methods=["GET","POST"])
def upload():
    if request.method == 'POST':
        
        submitted_file = request.files['file']
        # and allowed_filename(submitted_file)
        if submitted_file:
            filename = secure_filename(submitted_file.filename)
            submitted_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect('/?filename='+filename)
        return 'error uploading file'
	  
	  

# DLTK specific content end


@app.route("/output_nii/<path:path>", methods=["GET","POST"])
def send_js(path):
    return send_from_directory('output_nii', path)



@app.route("/", methods=["GET"])
def main():
    return render_template('index.html')


@app.route("/predict", methods=["POST"])
def predict():
    #fn = request.data['filename']
    # TODO  using the filename to set sonfig and run the model
	
	
	
	
	
	
	
    
    cuda_devices='0'
    conf="config_spm_tissue.json"
    csv="val.csv"

  
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
    tf.logging.set_verbosity(tf.logging.ERROR)

    # GPU allocation options
    os.environ["CUDA_VISIBLE_DEVICES"] = cuda_devices

    # Parse the run config
    with open(conf) as f:
        config = json.load(f)

   
	
	
	
	
	# Read in the csv with the file names you would want to predict on
    file_names = pd.read_csv(csv,
                             dtype=object,
                             keep_default_na=False,
                             na_values=[]).as_matrix()

    # From the model model_path, parse the latest saved estimator model
    # and restore a predictor from it
    export_dir = [os.path.join(config["model_path"], o) for o in os.listdir(config["model_path"])
                  if os.path.isdir(os.path.join(config["model_path"], o)) and o.isdigit()][-1]
    print('Loading from {}'.format(export_dir))
    my_predictor = predictor.from_saved_model(export_dir)

    protocols = config["protocols"]
    # Fetch the output probability ops of the trained network
    y_probs = [my_predictor._fetch_tensors['y_prob_{}'.format(p)] for p in protocols]

    # Iterate through the files, predict on the full volumes and
    #  compute a Dice similariy coefficient
    for output in read_fn(file_references=file_names,
                          mode=tf.estimator.ModeKeys.PREDICT,
                          params={'extract_examples': False,
                                  'protocols': protocols}):

        print('Running file {}'.format(output['img_id']))
        t0 = time.time()

        # Parse the read function output and add a dummy batch dimension
        #  as required
        img = np.expand_dims(output['features']['x'], axis=0)

        # Do a sliding window inference with our DLTK wrapper
        preds = sliding_window_segmentation_inference(
            session=my_predictor.session,
            ops_list=y_probs,
            sample_dict={my_predictor._feed_tensors['x']: img},
            batch_size=2)

        # Calculate the prediction from the probabilities
        preds = [np.squeeze(np.argmax(pred, -1), axis=0) for pred in preds]

        # Map the consecutive integer label ids back to the original ones
        for i in range(len(protocols)):
            preds[i] = map_labels(preds[i],
                                  protocol=protocols[i],
                                  convert_to_protocol=True)

        # Save the file as .nii.gz using the header information from the
        # original sitk image
        out_folder = os.path.join(config["out_segm_path"], '{}'.format(output['img_id']))

        os.system('mkdir -p {}'.format(out_folder))
		

        for i in range(len(protocols)):
            #output_fn = os.path.join(out_folder, protocols[i] + '.nii.gz')
            output_fn = os.path.join(out_folder, 'test_seg.nii.gz')
            new_sitk = sitk.GetImageFromArray(preds[i].astype(np.int32))
            new_sitk.CopyInformation(output['sitk'])
            try:
                os.remove(output_fn)
            except OSError:
                pass   
            sitk.WriteImage(new_sitk, output_fn)

        # Print outputs
        print('ID={}; input_dim={}; time={};'.format(
            output['img_id'], img.shape, time.time() - t0))
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    return "{result:'done'}"


@app.route('/model')
def model():
    json_data = json.load(open("./model_js/model.json"))
    return jsonify(json_data)

	
	
	

@app.route('/<path:path>')
def load_shards(path):
    return send_from_directory('model_js', path)


def preprocessing(file):
    in_memory_file = io.BytesIO()
    file.save(in_memory_file)
    data = np.fromstring(in_memory_file.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(data, 0)
    res = cv2.resize(img, dsize=(28, 28), interpolation=cv2.INTER_CUBIC)
    # file.save("static/UPLOAD/img.png") # saving uploaded img
    # cv2.imwrite("static/UPLOAD/test.png", res) # saving processed image
    return res


if __name__ == "__main__":
    app.run()
