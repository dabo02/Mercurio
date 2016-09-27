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

    .filter('timeStampFilter', function () {
        return function (timeStamp) {

            var date = new Date(timeStamp);
            var today = new Date();

            if(date.toDateString() === today.toDateString()){
                /*var totalSeconds = parseInt(timeStamp, 10); // don't forget the second param
                var hours   = Math.floor(totalSeconds % 3600);
                var minutes = Math.floor((totalSeconds % 3600) / 60);

                return hours + ':' + minutes;8*/
                return 'Today';
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