angular.module('zypeApp').controller('ModalCtrl', ['$uibModal', '$log', '$scope', '$rootScope', function ($uibModal, $log, $scope, $rootScope) {
  var $ctrl = this;

  $ctrl.animationsEnabled = true;
  // $ctrl.video = $ctrl.getVideo();

  $ctrl.open = function (size, video) {
    console.log("Video");
    console.log(video);
    $ctrl.video = video;

    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'video_content.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      resolve: {
        video: function () {
          return video;
        }
      }
    });

    modalInstance.result.then(function () {
      // $ctrl.selected = selectedItem;
      $ctrl.video = video;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $ctrl.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      component: 'modalComponent',
      resolve: {
        video: function () {
          return $ctrl.video;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('modal-component dismissed at: ' + new Date());
    });
  };

  $ctrl.toggleAnimation = function () {
    $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
  };

  // $ctrl.getVideo = function() {
  //   if($ctrl.video != "") return $ctrl.video;
  // }

}]);

angular.module('zypeApp').controller('ModalInstanceCtrl', function ($uibModalInstance, video) {
  var $ctrl = this;
  $ctrl.video = video;

  $ctrl.ok = function () {
    // $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('zypeApp').component('modalComponent', {
  templateUrl: 'video_content.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;

    $ctrl.$onInit = function () {
    };

    $ctrl.ok = function () {
    };

    $ctrl.cancel = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };
  }
});
