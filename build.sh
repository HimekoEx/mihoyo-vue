#!/usr/bin/env bash

if [ $# -eq 1 ]
then
    sudo docker build . -t "registry.cn-hongkong.aliyuncs.com/mihoyo_top/mihoyo-vue:$1"
    sudo docker push "registry.cn-hongkong.aliyuncs.com/mihoyo_top/mihoyo-vue:$1"
else
    echo 格式Error: $0 版本号
fi
