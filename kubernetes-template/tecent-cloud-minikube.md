
## 在腾讯云部署minikube（学习环境）

### 修改Ubuntu镜像
`sudo vim /etc/apt/sources.list`

追加后续镜像地址或者覆盖

```
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse

```

#### 更新并且验证

```
sudo apt update
sudo apt dist-upgrade
```

### 安装docker （最好先安装docker）


#### 卸载旧版本
```
sudo apt remove docker docker-engine docker.io containerd runc
//删除旧版本的k8s组件，没有安装可以不用管
sudo rm -rvf $HOME/.kube
sudo rm -rvf ~/.kube/
sudo rm -rvf /etc/kubernetes/
sudo rm -rvf /etc/systemd/system/kubelet.service.d
sudo rm -rvf /etc/systemd/system/kubelet.service
sudo rm -rvf /usr/bin/kube*
sudo rm -rvf /etc/cni
sudo rm -rvf /opt/cni
sudo rm -rvf /var/lib/etcd
sudo rm -rvf /var/etcd
```

#### 设置存储库
```
sudo apt update

sudo apt install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

#### 添加GPG密钥

` curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - `

#### 设置稳定存储库

```
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

#### 安装docker引擎
```
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```

#### 运行hello-world验证是否安装正常

`sudo docker run hello-world`

#### 创建docker组 (optional)
> Minikube需要在非root用户下使用；注意：再启动时也可以直接强制性用root启动，可以不用创建用户

```
useradd --r -m -s /bin/bash minikube
passwd minikube
adduser minikube sudo #给用户添加管理员权限
groupadd docker
usermod -aG docker minikube
newgrp docker
```

#### 直接使用root用户

```
apt install apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 

```
### 安装kubectl 
#### 设置源

```
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
```
#### 下载kubectl工具
`
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl`

#### 设置权限
`chmod +x ./kubectl`


#### 移动到系统目录下
`mv ./kubectl /usr/local/bin/kubectl`
#### 查看版本号
`kubectl version`


### 安装minikube

#### 设置权限，并且移动到usr的bin目录下
`
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/ `

#### 启动Kubernetes 集群

> 直接使用root账号强制启动，也可以使用上面创建的（minikube用户）：
`
minikube start --vm-driver=docker --base-image="anjone/kicbase" --force --kubernetes-version=1.23.0`

> 推荐使用国内镜像，避免ingress 安装失败

`minikube start --image-mirror-country='cn' --force --kubernetes-version=v1.23.1 --registry-mirror="https://docker.mirrors.ustc.edu.cn"`

#### 查看pods
`minikube kubectl -- get pod -A`

#### 如果没有安装kubectl 
```
cd ~
vim .bashrc
#添加如下内容并保存
alias kubectl="minikube kubectl --"
#生效
source .bashrc
#测试
kubectl get pods -A
```

#### 常用命令

```
#查看插件列表
minikube addons list

#安装插件dashboard
minikube addons enable dashboard

#查看连接
minikube dashboard --url

#进入minikube虚拟机 root密码应该与宿主机root密码一致（臆测）
minikube ssh

#获取ip
minikube ip

#宿主机目录影射虚拟机（亲测不好使报错未找到解决办法）
#&，表示命令在后台运行。minikube虚拟机重启后，挂载文件夹消失，即挂载是一次性的
minikube mount /path/to/HOST_MOUNT_DIRECTORY:/path/to/VM_MOUNT_DIRECTORY &

#另一种往minikube里传文件方式 scp 会提示minikube root密码 即为宿主机root密码
scp ./file.tar root@192.168.49.2:/mnt/

#开启metrics-server 指标监控
minikube addons enable metrics-server

#查看性能指标
k top node
k top pod

#开启LoadBalancer 和Ingress 以便暴露内部服务的访问
minikube addons enable metallb
minikube addons enable ingress
#查看pod的Ip 每个pod都有集群独一无二的ip，pod之间可以直接通信
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs

```


#### 问题汇总
出现：Exiting due to HOST_JUJU_LOCK_PERMISSION
执行：rm /tmp/juju-*

出现：Exiting due to RT_DOCKER_MISSING_CRI_DOCKER_NONE
原因：版本太高了，1.24开始，dockershim已经从kubelet中移除，但因为历史问题Docker却不支持K8S主推的CRI（容器运行时接口）标准，所以Docker不能再作为K8S的容器运行时了，即从K8S 1.24开始不再使用Docker了。但是如果想继续使用Docker的话，可以在kubelet和Docker之间加上一个中间层cri-docker。需要下载 https://github.com/Mirantis/cri-dockerd；这里更换一下版本：minikube start --vm-driver=docker --base-image=“anjone/kicbase” --force --kubernetes-version=1.23.0

##### 镜像下载慢
```
#先执行 
minikube delete
#再执行 
minikube start --force --image-mirror-country='cn'
```


#### 部署服务
```
kubectl create deployment nginx --image=nginx:1.14-alpine
kubectl expose deployment nginx --port=80 --type=NodePort  #暴露服务

kubectl port-forward svc/nginx 30000:30598 --address='0.0.0.0' &  #端口转发
```

> 需要在腾讯云中放开映射端口

#### 暴露服务

```
#暴露pod到宿主机方式 宿主机端口8090 pod端口80 如不指定--address 则是127.0.0.1
kubectl port-forward temp-chart-6d4cf56db6-rsxhr 8090:80 --address 10.0.8.101
#暴露service方式 将本地端口9800映射到svc的9100端口node-exporter为服务名称,如果不指定address则默认为127.0.0.1的地址
kubectl -n monitoring port-forward svc/node-exporter 9800:9100 --address 10.0.8.101

```


### 卸载
```
minikube stop
minikube delete --all
docker rmi 镜像id
rm -rf ~/.kube ~/.minikube
sudo rm -rf  /usr/local/bin/minikube
```


