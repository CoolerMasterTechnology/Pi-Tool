#!/bin/sh

echo -e "\e[38;5;91m"
echo """
                          XXXXXXXXXXXMXXXXX
                    XXXXXXXX             XXXXXXXX
               XXXXXXX      XXXXX   XXX        XXAXXXK
           XXXXXX    X     XXXXXXX  XXX     XXE     XXXXXI
         TXXX      XXXXXX  XYX OUXX XXX     XXRXXXS X   XXMX
       XAX  XXXX  XXX KXE XXX   XXX XXX     IXX  XX XXXXXX TXX
       YX XXXOUXX RX   XSXXXX   MXX XAX     XXKX    XXX XEI TX
      YXO XX      XU   XXXRXX   XXX XXS     MXXXXX  XXX XXX XAX
      XXX XK      XX   XX  XX   EXX XXX     XIX     XXXXXX  XXX
      XXX XXX XTX XXXXXYX  OXUXXXX  XXRXXXX XXXS    XXM XA  XXX
      XXX  XKXXX   XEXXX    XXXIT   XXXXYXO XUXXXXR SXX XXX XXM
      AXX                                                    KX
      XXX XXX  XXE   XXI    XXXXXX  XXXXTXX YXXXOXX XXXXXX  UXX
      XXX XXRXXXXX  SXXMX  XXXXXXXA XXXXKXE XXX     XXI XTY XXO
      XXX XXXXXURX  XXXXX  XXS   XX   XXX   XXX     XXXXXXX XXX
      XXX XXXXMXXX  AX XX  XXXXX      XXX   KXEXIXT XXXXXX  YXX
       XO XUXXX XX XXX XRX   XSXXM    XXX   XXX     XXA XKE XX
       IXXX  X  XX XXXTXXX      XXY   XXX   XXX OXX XUX  RSXXX
         MAXX      XX  KXX EXI  XXXX  XTX   XXXXXXX     YXOX
           XXUXXX       XXX XXXXXRXX  XXX   XSM    XXXXXXX
                XXXXXX       XXAXXX   XXX      XXKXXE
                    XXXXITXX             XYOXXXUX
                          XXXXXXXXXRXXXSXXX
"""
echo -e "\u001b[37;1m Cooler Master Pi Tool Installer\e[0m"
echo " version 0.1.2"
echo ""
sleep 0.5
echo " This tool is designed to be used together with Cooler Master's Pi Case 40,"
echo " for more information visit https://www.coolermaster.com"

echo ""
echo ""
sleep 1

customize_desktop()
{
	echo ""
	echo ""
	echo -e "\e[34m === Desktop customization === \e[0m"
	echo " Changing wallpaper..."
	cp /tmp/pi-tool/theme/cm_wallpaper.jpg ~/.cm_wallpaper.jpg
	pcmanfm --set-wallpaper ~/.cm_wallpaper.jpg
	echo " Changing GTK theme..."
	sleep 0.5
	echo ""
	echo -e "\e[32m Done!\e[0m"
}



# Download everything
echo " Downloading data..."
curl https://github.com/CoolerMasterTechnology/pi-tool/releases/latest/download/pi-tool.tar.gz -o /tmp/pi-tool.tar.gz &>/dev/null
cd /tmp
tar -xvf pi-tool.tar.gz &>/dev/null
echo " Download finished!"

while true; do
	read -p " Do you want to install the Cooler Master desktop customizations? [Y/n]: " yn
	case $yn in
		[Yy]* ) customize_desktop; break;;
		[Nn]* ) break;;
		* ) echo " Please answer yes or no.";;
	esac
done

echo ""
sleep 1

echo -e "\e[34m === Pi Tool installation ===\e[0m"
echo " Installing..."
sudo dpkg -i /tmp/pi-tool/*.deb
sudo apt-get install -f
echo " "
echo -e "\e[32m Done!\e[0m"

echo ""
echo ""
sleep 1

echo " You can now start the Pi Tool from your 'Applications' menu. Have fun!"
echo ""
