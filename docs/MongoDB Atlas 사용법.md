## 🍃 MongoDB 시작하기: Atlas 클라우드로 간편하게

Express 서버에 실제 데이터베이스를 연동해 보겠습니다. 우리는 가장 대표적인 NoSQL 데이터베이스인 **MongoDB**를 사용할 겁니다.

MongoDB를 사용하는 방법은 크게 두 가지가 있습니다.

- **로컬(Local) MongoDB**: MongoDB 소프트웨어를 내 컴퓨터에 직접 설치하는 방법.
- **클라우드(Cloud) MongoDB**: MongoDB 회사에서 제공하는 **MongoDB Atlas**라는 클라우드 서비스를 이용하는 방법.

우리는 두 번째 옵션인 **MongoDB Atlas**를 사용할 겁니다. Atlas를 사용하면 복잡한 설치 과정 없이 클릭 몇 번으로 데이터베이스를 만들 수 있고, 나중에 웹 서비스를 배포할 때도 아주 쉽게 연동할 수 있는 큰 장점이 있습니다.

### 🚀 MongoDB Atlas 데이터베이스 생성하기 (Step-by-Step)

이제부터 MongoDB Atlas에 가입하고, 데이터베이스를 생성한 뒤, 우리 Express 앱과 연결할 수 있는 고유 주소(URL)를 발급받는 과정을 알아보겠습니다.

#### 1\. 회원가입 및 클러스터 생성

먼저 **[MongoDB Atlas 회원가입 페이지](https://www.mongodb.com/cloud/atlas/register)** 로 이동하여 가입을 완료해 주세요.

가입 후에는 **클러스터(Cluster)** 를 설정해야 합니다. 클러스터는 클라우드에 생성되는 우리 데이터베이스 서버의 묶음이라고 생각하시면 됩니다. 학습 용도이므로 무료 버전을 선택하고, Provider나 Region 등은 자유롭게 설정한 뒤 **`Create Deployment`** 버튼을 클릭해 클러스터를 생성합니다.

#### 2\. 보안 및 데이터베이스 유저 설정

다음은 보안 설정입니다. 데이터베이스에 접속할 **유저 이름(Username)과 비밀번호(Password)를 설정**해야 합니다.

- **Username / Password**: 직접 입력하거나 자동 생성할 수 있습니다. **이 정보는 나중에 코드에서 필요하므로 반드시 안전한 곳에 기록해 두세요.**

설정이 완료되면 **`Create Database User`** 버튼을 눌러주세요.

#### 3\. 데이터베이스와 컬렉션 만들기

이제 클러스터 안에 실제 데이터를 담을 공간을 만듭니다.

1.  좌측 메뉴에서 **`Clusters`** 로 이동한 다음 **`Browse Collections`** 버튼을 클릭하세요.
2.  **`Add My Own Data`** 버튼을 클릭합니다.
3.  **Database name**에 `todo-api`, **Collection Name**에 `tasks`를 입력하고 **`Create`** 버튼을 누릅니다.

> **💡 데이터베이스(Database)와 컬렉션(Collection)**
> MongoDB에서 **데이터베이스**는 관련된 데이터들의 큰 묶음(컨테이너)이며, **컬렉션**은 그 안에 들어가는 실제 데이터들의 집합입니다. 관계형 데이터베이스의 '테이블'과 비슷한 역할을 합니다.

#### 4\. 연결 주소(URL) 복사하기

데이터베이스 생성이 완료되었으니, 이제 우리 Express 앱이 이 데이터베이스에 접속할 수 있는 비밀 주소(URL)를 가져올 차례입니다.

1.  다시 `Clusters` 메뉴로 돌아와 방금 만든 클러스터의 **`Connect`** 버튼을 클릭합니다.
2.  다양한 연결 방법 중 **`Drivers`** 를 선택합니다.
3.  Node.js 버전 등을 확인하고, **3번 항목 아래에 있는 연결 주소(Connection String)를 복사**합니다.

#### 5\. `.env` 파일에 연결 주소 저장하기

복사한 연결 주소는 민감한 정보이므로, 프로젝트 최상위 경로에 `.env` 파일을 만들고 그 안에 저장합니다.

> **⚠️ 중요:** 복사한 주소에서 `<password>` 부분은 **반드시 2단계에서 기록해 둔 실제 비밀번호로 변경**해야 합니다. 꺾쇠괄호(`< >`)도 모두 지워주세요. 유저 이름을 변경했다면 해당 부분도 바꿔주어야 합니다.

**`.env`**

```text
DATABASE_URL=mongodb+srv://<유저이름>:<실제_비밀번호>@...
```

---

### 🐘 Mongoose로 Express와 MongoDB 연결하기

Express 앱 안에서 MongoDB를 편리하게 사용하려면 라이브러리가 필요합니다. 우리는 가장 널리 쓰이는 **Mongoose**를 사용할 겁니다.

Mongoose는 JavaScript 코드로 MongoDB의 모든 기능을 세련되게 사용할 수 있게 해주는 **ODM(Object Data Modeling)** 라이브러리입니다. 복잡한 MongoDB 명령어를 몰라도, 익숙한 JavaScript 객체와 함수로 데이터를 다룰 수 있게 도와줍니다.

#### 1\. Mongoose 설치하기

터미널에 아래 명령어를 입력해 Mongoose를 설치합니다.

```bash
npm install mongoose
```

> 💡 튜토리얼을 따라 하는 경우, 특정 버전이 필요할 수 있습니다. 예를 들어 `npm install mongoose@"<8.0.0"`은 7.x 버전 중 최신 버전을 설치하는 명령어입니다.

#### 2\. `app.js`에서 데이터베이스 연결하기

`app.js` 파일에 아래 코드를 추가하여 Mongoose가 `.env` 파일에 있는 주소를 읽어 데이터베이스에 연결하도록 설정합니다.

```javascript
// app.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
// ... 다른 import 구문들

// .env 파일의 내용을 process.env에 로드합니다.
dotenv.config();

// ... app.use() 등 Express 설정 코드 ...

// Mongoose를 사용해 MongoDB에 연결합니다.
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected to DB'))
  .catch((err) => console.log('❌ DB Connection Error:', err));
```

- `mongoose.connect()` 메소드에 `.env` 파일에 저장했던 `DATABASE_URL`을 전달하여 연결을 시도합니다.
- 이 작업은 비동기적으로 처리되므로, `.then()`을 사용해 연결에 성공했을 때 실행할 코드를, `.catch()`를 사용해 실패했을 때 실행할 코드를 정의합니다.

### ✅ 연결 성공 확인하기

이제 서버를 실행(`npm start` 또는 `nodemon`)했을 때 터미널에 아래와 같은 성공 메시지가 뜨면 모든 설정이 완료된 것입니다\!

```bash
[nodemon] starting `node app.js`
Server started on port 3000
http://localhost:3000
✅ Connected to DB
```

이제 여러분의 Express 서버는 강력한 MongoDB 데이터베이스와 성공적으로 연결되었습니다. 🎉
