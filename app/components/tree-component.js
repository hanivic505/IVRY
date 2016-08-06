var app;
(function (app) {
	var Target;
	(function (Target) {
		angular.module("IVRY-App").component("tree", {
			templateUrl: "/app/components/tree.html",
			controller: treeComponent,
			bindings: {
				treeConfig: "="
			}
		});

		function treeComponent($scope, $element, $attrs, dbService) {

			var ctrl = this;
			$scope.dbService = dbService;
			$scope.addLine = function (trgt, title) {
				dbService.add(trgt, new Target.Line('New Line Object'));
			};

			this.collapsed = true;
			//	this.selectedNode=this.treeConfig.selectedNode;
			this.lines = this.treeConfig.lines;
			//	this.treeObj=angular.copy(this.treeConfig.treeObj);
			this.treeObj = this.treeConfig.treeObj;
			this.treeScndLvl = this.treeConfig.secondLevel;
			this.treeScndLvlTitle = this.treeConfig.secondLevelTitle;
			this.treeThrdLvl = this.treeConfig.thirdLevel;
			this.treeThrdLvlTitle = this.treeConfig.thirdLevelTitle;
			//	this.filterBy=this.treeConfig.filterBy;
			this.multiSelect = this.treeConfig.multiSelect == undefined ? false : this.treeConfig.multiSelect;
			this.allowEdit = this.treeConfig.allowEdit == undefined ? false : this.treeConfig.allowEdit;
			$scope.$watch(function () {
				return ctrl.treeConfig.selectedNode;
			}, function (nVal) {
				$scope.$emit("treeNodeSelected", nVal);
			});
			this.toggleCollapsed = function () {
				ctrl.collapsed = !ctrl.collapsed;
				for (var i = 0, el = ctrl.treeObj; i < el.length; i++) {
					el[i].expand = !ctrl.collapsed;
					el[i].childs = el[i].childs || el[i][this.treeScndLvl] || el[i][this.treeThrdLvl]
					if (el[i].childs != undefined)
						for (var j = 0, sEl = el[i].childs; j < sEl.length; j++) {
							sEl[j].expand = !ctrl.collapsed;
						}
				}
			};
			this.setSelectedNode = function (obj, typ) {
				ctrl.treeConfig.selectedNode = {
					data: obj,
					type: typ
				}
			};
			// enable checkboxes to select multiple elements
			if (this.multiSelect) {
				$scope.handleChkAll = function (obj, prop, isHandleTree = false) {
					if (isHandleTree && obj.id !== undefined)
						ctrl.lines[obj.id] = obj.checked;
					if (obj.childs)
						for (var i = 0; i < obj.childs.length; i++) {
							obj.childs[i][prop] = obj.checked;
							if (isHandleTree && obj.childs[i].id !== undefined)
								ctrl.lines[obj.childs[i].id] = obj.checked;
							if (obj.childs[i].childs)
								$scope.handleChkAll(obj.childs[i], prop, isHandleTree);
						}
				};
				if (ctrl.lines != undefined)
					$scope.handleChkAll(this.treeObj[0], "checked", true);
			}
		}
	})(Target = app.Target || (Target = {}));
})(app || (app = {}));