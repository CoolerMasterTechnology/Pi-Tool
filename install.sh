#!/bin/sh

echo "\e[38;5;91m"
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
echo "\e[37;1m Cooler Master Pi Tool Installer\e[0m"
echo ""
sleep 0.5
echo " This tool is designed to be used together with Cooler Master's Pi Case 40,"
echo " for more information visit https://www.coolermaster.com"

echo ""
echo ""
sleep 1

apply_gtk_theme()
{
	git clone https://github.com/Joshaby/Adapta-Colorpack
	cd Adapta-Colorpack/Pkg/usr/share/themes/Adapta-Purple-Nokto-Eta/

	find . -type f -name "*.css" -exec sed -i 's/rgba\(156, 39, 176, 0.8\)/rgba\(132, 50, 155, 0.9\)/g' {} +
	find . -type f -name "*.css" -exec sed -i 's/#263238/#53565A/g' {} +
	find . -type f -name "*.css" -exec sed -i 's/#9C27B0/#84329B/g' {} +

	cd ..
	mkdir -p /home/$USER/.themes
	cp -r Adapta-Purple-Nokto-Eta /home/$USER/.themes/Adapta-CoolerMaster

	GTK_CONFIG="/home/$USER/.gtkrc-2.0"

	if [ -f "$GTK_CONFIG" ]; then
		if [ ! -z $(grep "gtk-theme-name" "$GTK_CONFIG") ]; then 
			sed -i 's/^gtk-theme-name=.*/gtk-theme-name="Adapta-CoolerMaster"/g' "$GTK_CONFIG"
		else
			echo 'gtk-theme-name="Adapta-CoolerMaster"' >> "$GTK_CONFIG"
		fi
	else
		echo 'gtk-theme-name="Adapta-CoolerMaster"' > "$GTK_CONFIG"
	fi

	while true; do
		read -p " Do you want to apply these changes now? [Y/n]: " yn
		case $yn in
			[Yy]* ) lxpanelctl restart && openbox --restart; break;;
			[Nn]* ) break;;
			* ) echo " Please answer yes or no.";;
		esac
	done
        echo " You can select the CM theme by executing 'lxappearance'."
}

customize_desktop()
{
	echo ""
	echo ""
	echo "\e[34m === Desktop customization === \e[0m"
	echo " Installing theme installation dependencies..."
	sudo apt install git
	echo " Changing wallpaper..."
	cp /tmp/cm_wallpaper.jpg ~/.cm_wallpaper.jpg
	pcmanfm --set-wallpaper ~/.cm_wallpaper.jpg
	echo " Changing GTK theme..."
	apply_gtk_theme
	echo ""
	echo "\e[32m Done!\e[0m"
}

# Download everything
echo " Downloading data..."
cd /tmp
curl -L https://github.com/CoolerMasterTechnology/Pi-Tool/releases/latest/download/pi-tool-$(dpkg --print-architecture).deb -o pi-tool.deb
curl -L https://github.com/CoolerMasterTechnology/Pi-Tool/raw/master/theme/cm_wallpaper.jpg -o cm_wallpaper.jpg
echo ""
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

echo "\e[34m === Pi Tool installation ===\e[0m"
echo " Installing..."

deb_file_path="/tmp/pi-tool*.deb"
sudo apt-get install $deb_file_path

echo " "
echo "\e[32m Done!\e[0m"

echo ""
echo ""
sleep 1

echo " You can now start the Pi Tool from your start menu. Have fun!"
echo ""

