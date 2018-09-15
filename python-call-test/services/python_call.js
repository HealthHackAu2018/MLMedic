var PythonShell = require('python-shell');
var pythonPath = 'C:/Users/holly/Miniconda2/envs/mlmedic-2 python';
var pythonScriptBase = 'python';
var fs = require('fs');

dltk_scriptPath = pythonScriptBase + '/models/ukbb_neuronet_brain_segmentation';

dltk_config = {
  "protocols": ["spm_tissue"],
  "num_classes": [4],
  "model_path": dltk_scriptPath + "/spm_tissue",
  "out_segm_path": "segment_out\\spm_tissue",
  "learning_rate": 0.001,
  "network": {
    "filters": [16, 32, 64, 128],
    "strides": [[1, 1, 1], [2, 2, 2], [2, 2, 2], [2, 2, 2]],
    "num_residual_units": 2
  }
}
fs.writeFile('models/config.json', JSON.stringify(dltk_config), 'utf8', function(){});
const dltk_header = "id,t1,fsl_fast,fsl_first,spm_tissue,malp_em,malp_em_tissue\n";

const options_dltk = {
  mode: 'text',
  // pythonPath: pythonPath,
 // C:\Users\holly\Documents\2018\MLMMedic\python-call-test\python\models\ukbb_neuronet_brain_segmentation
 //  scriptPath:  "C:\\Users\\holly\\Documents\\2018\\MLMMedic\\python-call-test\\python\\models\\ukbb_neuronet_brain_segmentation",
  scriptPath: dltk_scriptPath,
  args: ['--csv', 'models/files.csv', '--config', 'models/config.json']
};

const dltk_infer = 'deploy.py';

module.exports = {
  dltk_brain: function(id,file) {
    return new Promise(function(resolve, reject) {
      // Write files.csv
      csv_data = dltk_header + "5404127," + file + ",T1_brain_seg.nii.gz,all_fast_firstseg.nii.gz,T1_brain_seg_spm.nii.gz,T1_MALPEM.nii.gz,T1_MALPEM_tissues.nii.gz\n";
      fs.writeFile('models/files.csv', csv_data, 'utf8', function(err){
        if (err) {
          console.log(err);
          reject(err);
        } else {
          PythonShell.PythonShell.run(dltk_infer, options_dltk, function (err, results) {
            if (err) {
              console.log(err);
              reject(err);
            }
            console.log('results: %j', results);
            resolve(results);
          });
        }
      });

    })
  }
};