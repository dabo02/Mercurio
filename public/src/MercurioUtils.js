/**
 * Created by brianlandron on 9/21/16.
 */
(function(){

    'user_strict';

    angular.module('mercurio')

    .filter('chatListParticipantNameFilter', function () {
        return function (chat, chatClientOwner) {

            if(chat.lastMessage.from === 'undefined'){
                return '';
            }

            if(chat.lastMessage.from === chatClientOwner){
                return 'You';
            }

            var participantName = '';

            chat.participantList.forEach(function (participant) {
                if (chat.lastMessage.from === participant.userId) {
                    participantName = participant.firstName + ' ' + participant.lastName;
                }
            });

            return participantName;

        };
    })

    .filter('messageListParticipantNameFilter', function () {
        return function (from, participantList) {



            var participantName = '';

            //don't show names on 1-to-1 chat, show them in group chats instead

            if(participantList.length > 2){

                participantList.forEach(function (participant) {
                    if (from === participant.userId) {
                        participantName = participant.firstName + ' ' + participant.lastName + ', ';
                    }
                });
            }

            return participantName;

        };
    })

    .filter('chatListAvatarFilter', function () {
        return function (chat, chatClientOwner) {

            var avatarUrl = '';

            if(chat.title.length > 0){

                avatarUrl = 'images/default_group_avatar.png';
            }
            else{
                chat.participantList.forEach(function (participant) {
                    if (chatClientOwner !== participant.userId) {
                        if(participant.picture === ""){
                            avatarUrl = 'images/default_contact_avatar.png';
                        }
                        else{
                            avatarUrl = participant.picture;
                        }
                    }
                });
            }

            return avatarUrl;

        };
    })

    .filter('contactListAvatarFilter', function () {
        return function (picture) {

            var avatarUrl = '';

            if(picture === ""){
                avatarUrl = 'images/default_contact_avatar.png';
            }
            else{
                avatarUrl = picture;
            }

            return avatarUrl;

        };
    })

    .filter('timeStampFilter', function () {
        return function (timeStamp) {

            var date = new Date(timeStamp);
            var today = new Date();


            if(date.toDateString() === today.toDateString()){

                var hour = date.getHours();
                var min = date.getMinutes();

                if(min < 10){
                    min = '0' + min;
                }

                if(hour == 0){
                    return '12:' + min + ' am';
                }
                else if(hour == 12 ){
                    return '12:' + min + ' pm';
                }
                else if(hour > 12){
                    return (hour - 12) + ':' + min + ' pm';
                }
                else{
                    return hour + ':' + min + ' am';
                }

            }
            else if((today.getDate() - date.getDate()) == 1){
                return 'Yesterday';
            }
            else{
                return date.toDateString();
            }
        };
    })

    .filter('chatTitleFilter', function () {
        return function (chat, chatClientOwner) {

            var title = '';

            if(chat.title.length > 0){
                title = chat.title;
            }
            else{
                chat.participantList.forEach(function (participant) {
                    if (chatClientOwner !== participant.userId) {
                       title = participant.firstName + ' ' + participant.lastName;
                    }
                });
            }

            return title;
        };
    })

    .filter('chatListTextContentPreviewFilter', function () {
        return function (message) {

            if(message.textContent.length > 16){
                return message.textContent.slice(0, 15) + "...";
            }
            else{
                return message.textContent;
            }

        };
    })

    .filter('callListDirectionFilter', function () {
        return function (incoming, answered) {

            if(incoming && answered){
                return 'images/in.png';
            }
            else if(incoming){
                return 'images/missed.png';
            }
            else{
                return 'images/out.png';
            }

        };
    })

    .filter('callListNameFilter', function () {
        return function (from, to, incoming, contactList) {

            var participant;
            if(incoming){
                participant = from;
            }
            else{
                participant = to;
            }
            contactList.forEach(function(contact){
                if(contact.phone == participant){
                    participant = contact.firstName + " " + contact.lastName ;
                }
            })

            return participant;

        };
    })

    .filter('callListAvatarFilter', function () {
        return function (from, contactList) {

            var avatarUrl = 'images/contacts.png'
            contactList.forEach(function(contact){
                if(contact.phone == from){
                    avatarUrl = contact.picture;
                }
            })

            return avatarUrl;

        };
    })

    .filter('callableRecordsFilter', function(){
        return function(callableRecords, type){

            var records = [];
            for(var list in callableRecords){
                switch(list){
                    case 'Leads':
                        break;
                    case 'Contacts':
                        break;
                    case 'Accounts':
                        break;
                }
            }
        }
    })

    .filter('createChatTextFilter', function(){
        return function(groupChatCheckbox){

            if(groupChatCheckbox){
                return 'Group';
            }
            else{
                return 'Chat';
            }
        }
    })

    .filter('chatClientOwnerGroupMemberFilter', function(){
        return function(chat, chatClientOwner){

            var isChatClientOwnerGroupMember = false;

            chat.participantList.forEach(function(participant){
                if(participant.userId == chatClientOwner){
                    isChatClientOwnerGroupMember = true;
                }
            });

            return isChatClientOwnerGroupMember;
        }
    })

    .filter('insertCallsAutomaticallyCheckboxFilter', function(){
        return function(crmList){
            if(crmList.length > 0){
                return crmList[0].insertCallsAutomatically;
            }
            else{
                return false;
            }
        }
    })

    .directive('scrollToBottom', function () {
        return {
            scope: {
                scrollToBottom: "="
            },
            link: function (scope, element) {
                scope.$watchCollection('scrollToBottom', function (newValue) {
                    if (newValue)
                    {
                        $(element).scrollTop($(element)[0].scrollHeight);
                    }
                });
            }
        }
    });
})();