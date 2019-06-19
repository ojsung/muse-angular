export const cpeCommandList = {
  'get_bootval vivint_hw_id': `There are three models of CPEs that we use: 1420, 1411, and 1410. Any 1411s or 1410s found in the field should be reported to QRF for replacement.

    Display radio model
    "0" (zero): 1410
    1411: 1411
    14xx: 1420`,
  'cat smartrove.sh': `"smartrove.sh" is a file that runs on bootup. The inner contents should look as follows:

  # Reset MAC address from u-boot
  /mnt/jffs2/RestoreMac`,
  'cat wireless_conf.txt': `
  There are several configurations, separated by ampersand (&).  These must be correct:
  mode=sta
  region=us
  staticip=0
  bw=40
  `,
  uptime: `See how long the CPE has been online since it’s last reboot (formatted in hours:minutes:seconds)`,
  'cat /proc/bootcfg/tx_power_us.txt': `"tx_power_us.txt" contains the current power levels for each channel.

  Only Band 1 should show as (-1)
  Minimum is 8, Maximum is 19
  If the CPE’s “RSSI” stat is between 0 and -499, the power levels will likely need to be lowered. If the CPE’s “RSSI” is between -750 and -1000, the power levels will likely need to be raised. If the CPE’s “RSSI” is between -500 and -749, the power levels are fine.`,
  './link-alignment.sh': `This will display the amount of signal each antenna on the AP is receiving. There are four total antennae on an AP.

  Dead antennae show as “-100”
  The average of these values will equal the RSSI, divided by 10`,
  show_assoc_table: `This command will display the current CPE's associated AP

  Display the AP’s stats in relation with the CPE (QUAL, RSSI, and SNR)
  QUAL: above 120
  RSSI: between -500 and -750
  SNR: further negative than -250`,
  'brctl showmacs br0': `Display the radio's bridging table

  Customer's Device: Port is 1, local is no
  Ageing timer should show less than 5 seconds`,
  dmesg: `This command shows log of radio. Time stamp on the left is in seconds relative to the device's uptime. It can be used to find:

  Frequent disassociations/associations of CPE's
  Overloaded errors
  Interfaces disabling/enabling
  Link up/link down
  Radar events / channel changes`
}
