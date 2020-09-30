#!/bin/sh
echo "Cooler Master Pi Tool minimal CLI"
echo ""
sleep 0.5

CONFIGF="/boot/config.txt"

10percent()
{
        echo ""
        echo arm_freq=1650 >> $CONFIGF
        echo gpu_freq=550 >> $CONFIGF
        echo over_voltage=2 >> $CONFIGF
        echo ""
        echo "\e[32m Done!\e[0m"
}

20percent()
{
        echo ""
        echo arm_freq=1800 >> $CONFIGF
        echo gpu_freq=600 >> $CONFIGF
        echo over_voltage=4 >> $CONFIGF
        echo ""
        echo "\e[32m Done!\e[0m"
}

30percent()
{
        echo ""
        echo arm_freq=1950 >> $CONFIGF
        echo gpu_freq=650 >> $CONFIGF
        echo over_voltage=5 >> $CONFIGF
        echo ""
        echo "\e[32m Done!\e[0m"
}

restorebase()
{
        echo "Restore base values..."
}

while true; do
        read -p " Do you want to overclock or restore the base values? [1/2/3/4/0]: " 12340
        printf "\n1.) 10 Percent\n2.) 20 Percent\n3.) 30 Percent\n4.) Restore base values\n0.) Exit\n
        case $yn in
                [1]* ) 10percent; break;;
                [2]* ) 20percent; break;;
                [3]* ) 30percent; break;;
                [4]* ) restorebase; break;;
                [0]* ) break;;
                * ) echo "Please answer with 1, 2, 3, 4 or 0";;
        esac
done

sleep 1
exit 0;