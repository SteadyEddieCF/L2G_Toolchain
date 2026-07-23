from pathlib import Path
import hashlib
root=Path(__file__).resolve().parents[1]
runtime=root/'CMMC_L2_SSP_Modern_Editable_v1.9.5.1.html'
text=runtime.read_text()
assert hashlib.sha256(runtime.read_bytes()).hexdigest()=='a291b6b1c13b6232ca73e7ed00c9fed40eccdd216ee8bda8ceb4f3dfb59599e8'
for token in ["APP_VERSION='1.9.5.1'", "SCHEMA='cmmc-l2-ssp-modern-v1.9.5.1'", "CMMC_L2_SSP_v1.9.5.1_Data_Backup.json", "cmmc-l2-ssp-modern-v1.9.5-working", "l2g_ssp_handoff_v1", "l2g_ssp_return_package_v1", "cmmc_l2_ssp_responsibility_matrix_snapshot_v1"]: assert token in text
assert "CMMC_L2_SSP_v1.8.4_Data_Backup.json" not in text
print('PASS')
