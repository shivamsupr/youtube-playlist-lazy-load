function YTJV() {
}

var YTJ = new YTJV();
YTJ.g = {};

YTJV.prototype.initLazyYoutubeVideoPlayList = function ($elements) {
    YTJ.g['ytScriptStatus'] = 0;
    YTJ.g['ytPlayerWidth'] = 0;
    YTJ.g['ytPlayerHeight'] = 0;
    YTJ.g['ytPlayer'] = null;
    YTJ.g['ytElement'] = null;

    var $videoGallery = $('#videoGallery');
    var $videoBar = $('.videoBar', $videoGallery);
    var $videoList = $('.videoList', $videoGallery);
    var $youtubeVideoImg = $('.youtubeVideoImg', $videoGallery);
    var $youtubeVideoOvrly = $('.youtubeVideoOvrly', $videoGallery);

    $videoBar.on('click', function () {
        var $videoBarIcn = $('.videoBarIcn', $videoBar);

        $videoList.slideToggle();
        $videoBarIcn.html($videoBarIcn.text() == '▼' ? '▲' : '▼');
    });

    $elements.on('click', function () {
        var $self = $(this);
        var $parent = $self.parent();
        var video_id = $self.data('video-id');
        YTJ.g['ytElement'] = $self;

        if (YTJ.g['ytPlayerWidth'] == 0 && YTJ.g['ytPlayerHeight'] == 0) {
            YTJ.g['ytPlayerWidth'] = $youtubeVideoImg.width();
            YTJ.g['ytPlayerHeight'] = $youtubeVideoImg.height();
        }

        _selectListItem($self, $parent);
        if ($parent.hasClass('videoList')) {
            $('.playVideoItm').removeClass('selected');
            $('.playVideoIcn').addClass('hide');

            $('.playVideoItm', $self).addClass('selected');
            $('.playVideoIcn', $self).removeClass('hide');
        }

        _loadYoutubeScript(function () {
            $youtubeVideoOvrly.remove();
            _displayVideoPlayer(video_id);
        });
    });

    var _loadYoutubeScript = function (callback) {
        if (YTJ.g['ytScriptStatus'] != 200) {
            $.getScript("https://www.youtube.com/iframe_api", function (data, textStatus, jqxhr) {
                if (jqxhr.status == 200) {
                    YTJ.g['ytScriptStatus'] = jqxhr.status;
                    callback();
                }
            });

            return false;
        }

        if (YTJ.g['ytScriptStatus'] == 200) {
            callback();
        }
    };

    var _displayVideoPlayer = function (video_id) {
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
            window.onYouTubeIframeAPIReady = function () {
                _loadVideoPlayer(video_id);
            }
        } else {
            _loadVideoPlayer(video_id);
        }
    };

    var _loadVideoPlayer = function (video_id) {
        if (YTJ.g['ytPlayer'] != null) {
            YTJ.g['ytPlayer'].destroy();
        }

        YTJ.g['ytPlayer'] = new YT.Player('youtubeVideoImg', {
            videoId: video_id,
            width: YTJ.g['ytPlayerWidth'],
            height: YTJ.g['ytPlayerHeight'],
            playerVars: {
                'autoplay': 1
            },
            events: {
                'onReady': _onPlayerReady,
                'onStateChange': _onPlayerStateChange
            }
        });
    };

    var _onPlayerReady = function () {
        console.log('_onPlayerReady');
    };

    var _onPlayerStateChange = function (event) {
        // when event.data is 0 that means playback has been ended
        // so you can play next video
        if (event.data == 0) {
            var $parent = YTJ.g['ytElement'].parent();
            var $nextElem = null;

            if ($parent.hasClass('videoPlayer')) {
                var $videoList = $('.videoList', $parent.parent());
                $nextElem = $videoList.find('.playVideo:nth-child(2)');
            } else if ($parent.hasClass('videoList')) {
                $nextElem = YTJ.g['ytElement'].next();
            }

            if ($nextElem != null) {
                $nextElem.trigger('click');
            }
        }
    };


    var _selectListItem = function ($elem, $parent) {
        if ($parent.hasClass('videoList')) {
            $('.playVideoItm').removeClass('selected');
            $('.playVideoIcn').addClass('hide');

            $('.playVideoItm', $elem).addClass('selected');
            $('.playVideoIcn', $elem).removeClass('hide');
        }
    };
};

$(document).ready(function () {
    YTJ.initLazyYoutubeVideoPlayList($('.playVideo'));
});