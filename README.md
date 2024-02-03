<!-- @format -->

# env-manager

- 환경변수를 관리하는 CLI Tool
- aws 의 parameter store service 기반

## Pre-requisite

### Install & setup aws cli (Mac)

- brew 를 이용하여 install

```
brew install awscli
```

- `~/.aws/credential` setting

```
aws configure
>>>
AWS Access Key ID [****************YDXZ]
...
```

- access key 정상 설정 확인

```
aws sts get-caller-identity
>>>
{
    "UserId": "AIDAYZS...",
    "Account": "6047...",
    "Arn": "arn:aws:iam::6047..."
}
```

## Install

```
npm install js-env-manager
```

```
npx js-env-manager --help
>>>
Usage: env-manager [options] [command]

ENV Managing CLI tool

Options:
  -s, --stage <type>        env stage. (choices: "dev", "prod")
  -p, --aws-profile <type>  aws profile (default: "default")
  -r, --repo <type>         repository name (default: "badge-tool")
  -h, --help                display help for command

Commands:
  bulk-set [options]        bulk set from env file. (remove all values which has been previously set )
  set                       set key, value pair
  print-all                 print all envs
  delete                    delete key, value pair
```

## How To Use

### bulk set

- .env 파일에 설정된 variables 을 일괄 업데이트
- 기존에 upload 한 env 를 모두 지우고 업데이트함

```
npx js-env-manager bulk-set -s [dev|prod] -p {aws profile (default: detault)} -f {env file path}
```

### print-all

- 등록된 환경변수 확인
- 해당 command 를 통해 환경 변수 파일 생성 가능

```
npx js-env-manager print-all -s [dev|prod] -p {aws profile (default: detault)}

# file 생성
npx js-env-manager print-all -s [dev|prod] -p {aws profile (default: detault)} > {file name}
```

### set

- 특정 variable 을 등록/업데이트

```
npx js-env-manager set -s [dev|prod] -p {aws profile (default: detault)}
```

### delete

- 특정 variable 을 삭제

```
npx js-env-manager delete -s [dev|prod] -p noox
```
