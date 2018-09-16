#
pip install dicom2nifti
git clone git@github.com:thomshaw92/dicom2nifti.git
import dicom2nifti
import dicom2nifti.settings as settings
from pathlib import Path
dicom = Path("path/to/dicom_dir")
output = "path/to/nifti.nii.gz"
(dicom2nifti.dicom_series_to_nifti(dicom, output, reorient_nifti=True))
