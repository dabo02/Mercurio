# Mercurio Web Interface

This repository includes code for:

* Serving the application interface.
* Rendering the application interface, which has been integrated with the Mercurio SDK.
* Routes for CRM integration.
* Routes for FCM push notifications used to notify iOS devices that a chat message was sent.

<br/>

## Getting Started

### Prerequisites

You will need **git** to clone the mercurio-web-interface repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize mercurio-web-interface. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone mercurio-web-interface

To get you started on development you can simply clone `development` branch from using [git][git]:

```
git clone https://*** YOUR USER NAME ***@bitbucket.org/optivon/web-interface-mercurio.git
cd mercurio-web-interface
git checkout development
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and AngularJS framework code.  The tools help
us manage and test the application.

<br/>

We get the tools we depend upon via `npm`, the [node package manager][npm]. To install dependencies run:

```
npm install
```

You should find that you have one new folder in your project.

* `node_modules` - contains the npm packages for the tools we need


## Directory Layout

```
.
├── LICENSE
├── README.md
├── bin
│   └── www
├── mercurio-server.js
├── mercurioTree.txt
├── node_modules.zip
├── package.json
├── public
│   ├── assets  
│   ├── audio
│   ├── images
│   ├── index.html
│   ├── lib
│   │   └── mercurio-sdk
│   │       ├── account
│   │       │   ├── AbstractAccount.js
│   │       │   ├── MercurioAccount.js
│   │       │   └── MercurioAuthenticator.js
│   │       ├── chat
│   │       │   ├── AbstractChat.js
│   │       │   ├── AbstractChatClient.js
│   │       │   ├── MercurioChat.js
│   │       │   ├── MercurioChatClient.js
│   │       │   ├── MercurioChatParticipant.js
│   │       │   ├── Message.js
│   │       │   ├── SMSChat.js
│   │       │   ├── SMSChatClient.js
│   │       │   └── SMSChatParticipant.js
│   │       ├── contacts
│   │       │   ├── AbstractContact.js
│   │       │   ├── AbstractContactManager.js
│   │       │   ├── Contact.js
│   │       │   ├── MercurioContact.js
│   │       │   └── MercurioContactManager.js
│   │       ├── crm
│   │       │   ├── AbstractCRM.js
│   │       │   ├── AbstractCRMManager.js
│   │       │   ├── MercurioCRMManager.js
│   │       │   └── ZohoCRM.js
│   │       ├── errors
│   │       │   ├── AbstractFunctionError.js
│   │       │   ├── ConstructorError.js
│   │       │   └── MissingImplementationError.js
│   │       └── phone
│   │           ├── JanusPhone.js
│   │           ├── MercurioPhone.js
│   │           └── RecentCall.js
│   └── src
│       ├── MercurioUtils.js
│       ├── account
│       │   ├── AccountService.js
│       │   ├── AuthenticationController.js
│       │   ├── AuthenticationService.js
│       │   ├── ProfileEditorController.js
│       │   ├── ProfileEditorDirective.js
│       │   ├── loginForm.html
│       │   ├── profileEditorForm.html
│       │   └── register.html
│       ├── chats
│       │   ├── ChatClientService.js
│       │   ├── ChatController.js
│       │   ├── ChatGroupDetailsController.js
│       │   ├── ChatGroupDetailsDirective.js
│       │   ├── ChatListController.js
│       │   ├── ChatListDirective.js
│       │   ├── ChatParticipantSelectionController.js
│       │   ├── CreateChatController.js
│       │   ├── addChatForm.html
│       │   ├── chat.html
│       │   ├── chatGroupDetails.html
│       │   ├── chatList.html
│       │   ├── directives.js
│       │   └── optionController.js
│       ├── contacts
│       │   ├── ContactController.js
│       │   ├── ContactListController.js
│       │   ├── contactProfile.html
│       │   ├── contacts.html
│       │   ├── contactsDirective.js
│       │   ├── editProfile.html
│       │   ├── editProfileController.js
│       │   └── editProfileDirective.js
│       ├── crm
│       │   ├── AddCallToCRMController.js
│       │   ├── CRMListController.js
│       │   ├── CRMService.js
│       │   ├── ManageCRMController.js
│       │   ├── addCallToCRMForm.html
│       │   ├── crmList.html
│       │   ├── directives.js
│       │   └── manageCRMForm.html
│       ├── imgOrientation.js
│       ├── mercurio-ng.js
│       ├── navigation-bars
│       │   ├── AboutDialogController.js
│       │   ├── NavigationController.js
│       │   ├── leftSidebar.html
│       │   ├── leftSidebarDirective.js
│       │   ├── navBar.html
│       │   ├── navBarDirective.js
│       │   ├── rightSidebar.html
│       │   └── rightSidebarDirective.js
│       ├── phone
│       │   ├── CallController.js
│       │   ├── CallDetailsController.js
│       │   ├── IncomingCallDialogController.js
│       │   ├── PhoneService.js
│       │   ├── RecentCallListController.js
│       │   ├── all.html
│       │   ├── call.html
│       │   ├── callDirective.js
│       │   ├── callStatusToolbar.html
│       │   ├── dialer.html
│       │   ├── dialerController.js
│       │   ├── dialerDirective.js
│       │   ├── directives.js
│       │   ├── edit.html
│       │   ├── editController.js
│       │   ├── missed.html
│       │   ├── recentCallList.html
│       │   ├── rightSidebarList.html
│       │   ├── rightSidebarListDirective.js
│       │   ├── userProvider.js
│       │   ├── videoCall.html
│       │   └── videoCallDirective.js
│       ├── userProvider.js
│       └── users
│           ├── Contacts.js
│           ├── UserController.js
│           ├── UserService.js
│           ├── Users.js
│           └── userContent.js
├── push-notification-server.js
├── routes
    ├── index.js
    ├── notification.js
    ├── self-provisioning.js
    ├── sms.js
    └── users.js
```


## Serving the Application Files

Start serving the application files by running:

```
node ./bin/www
```

> NOTE: Mercurio WebRTC Gateway must be up and running to make/receive calls with Mercurio Web Interface.
Refer to their respective documentation in the development team's Google Drive storage /Projects/Mercurio/Design


## Mercurio SDK and web interface integration

The Mercurio web interface was developed with Angular JS and Angular Material modules for Angular JS. It is tied to the
Mercurio SDK via the following Angular JS services:

* AuthenticationService
* AccountService
* ChatClientService
* CRMService
* PhoneService