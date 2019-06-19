export const apCommandList = {
  show_assoc_table: `This command will display the current CPEs associated to the AP

  Show the MAC address of the associated CPEs.
  Display the AP’s stats in relation with the CPE (QUAL, RSSI, and SNR)
  QUAL: above 120
  RSSI: between -500 and -750
  SNR: further negative than -250`,
  'cat smartrove.sh': `"smartrove.sh" is a file that runs on bootup. The inner contents should look as follows:

  # Reset MAC address from u-boot
  /mnt/jffs2/RestoreMac
  route add default gw xx.xx.xx.xx`,
  'cat hostapd.conf': `hostapd.conf contains the configurations the AP uses to control how it communicates with its CPEs.

  WPS State should be set at “0” (zero)
  The wpa_group and wpa_gmk rekey values should be set at “300000”`,
  'cat wireless_conf.txt': `There are several configurations, separated by ampersand (&).  These must be correct:
  mode=ap
  region=us
  staticip=1
  bw=40`,
  'cat /proc/bootval/tx_power_us.txt': `"tx_power_us.txt" contains the current power levels for each channel.

  Disabled channels show as (-1)
  Minimum is 8, Maximum is 19`,
  uptime: `See how long the AP has been online since it’s last reboot (formatted in hours:minutes:seconds)`,
  './link-alignment.sh': `This will display the amount of signal each antenna on the AP is receiving. There are four total antennae on an AP.

  Dead antennae show as “-100”
  The average of these values will equal the RSSI, divided by 10`,
  qcsapi: {
    'call_qcsapi get_csw_records wifi0': `Our radios have a wide range of channels on which they can operate. It is not uncommon for an AP to change channels multiple times a year. However, if the number of changes is too high, it can create a poor experience for customers. This command, nested in the QCS API, will allow you to check the number of changes the AP has undergone since its last reboot.`,
    'call_qcsapi get_scs_report wifi0 <parameter>': `This command is used to see the amount of interference on each channel the AP can see. It also measures some stats like the aci, cci, and cca_intf. This command takes an extra parameter over those used by default. The commands with the appended parameters are as follows:

    call_qcsapi get_scs_report wifi0 all
    Record of the last 32 channel changes
    Display interference of the available channels.
    0-200 is considered low
    201-400 is considered mid-range
    401+ is considered high
    call_qcsapi get_scs_report wifi0 autochan
    List of surrounding Wi-fi devices, by channel
    Display the aci and cci
    cci: the concurrent channel interference, or number of nearby Wi-Fi devices sharing the same channel
    aci: the adjacent channel interference, or number of nearby Wi-Fi devices on similar or nearby channel
    call_qcsapi get_scs_report wifi0 current
    The information for the current channel`
  },
  dmesg: `This command shows log of radio. Time stamp on the left is in seconds relative to the device's uptime. It can be used to find:

  Frequent disassociations/associations of CPE's
  Overloaded errors
  Interfaces disabling/enabling
  Link up/link down
  Radar events / channel changes`,
  reboot: `While CPEs can be rebooted at the Tier 1 agent's discretion, APs can only be rebooted by QRF or with QRF approval.

  Log into the AP/CPE with putty
  Type in the command “reboot”
  APs are only rebooted with QRF approval`
}
