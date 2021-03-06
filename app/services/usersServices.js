var app;
(function (app) {
	var services;
	var User;
	(function (services, User) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					conditions: [],
					orders: [],
					pageSize: 10,
					currentPage: 1,
					get: function (pgNum, condition, pSize, resetCondition) {
						console.info("usersService.get:before", this.currentPage, this.conditions, this.orders);
						this.conditions = condition == undefined ? resetCondition || resetCondition == undefined ? [] : this.conditions : condition;
						//this.orders = order;
						this.pageSize = pSize == undefined ? this.pageSize : pSize;
						this.currentPage = pgNum == undefined ? this.currentPage : pgNum;
						console.info("usersService.get:after", this.currentPage, this.conditions, this.orders);
						return $http.post(API_BASE_URL + "/user-list/search", {
							pageSize: this.pageSize,
							pageNumber: this.currentPage,
							andConditions: this.conditions,
							order: this.orders
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							},
						}).then(function (response) {
							return response.data.data;
						}, function (error) {
							$rootScope.message = {
								body: error.data.message,
								type: 'danger',
								duration: 5000,
							};
							return [];
						});
					},
					getAssignedUsers: function (line) {
						return $http.get(API_BASE_URL + "/line-user/line/" + line.id, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							console.info("usersService::getAssignedUsers", response);
							return response.data.data;
						}, function (error) {});
					},
					assignUsers: function (line, users) {
						return $http.put(API_BASE_URL + "/line/user", {
							line: {
								id: line.id
							},
							systemUsers: users
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "User(s) Assigned Successfully to line " + line.lineName,
								type: 'success',
								duration: 5000,
							};
						}, function (error) {
							$rootScope.message = {
								body: error.data.message,
								type: 'danger',
								duration: 5000,
							};

						});;
					},
					assignRights: function (id, rights) {
						return $http.put(API_BASE_URL + "/line-user/access-right", {
							lineSystemUser: {
								id: id
							},
							accessRights: rights
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						});
					},
					getUsersInDep: function () {
						return $http.get(API_BASE_URL + "/user-list", {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							return response.data.data;
						}, function (error) {});
					},
					getUser: function (objID) {
						return $http.get(API_BASE_URL + "/system-user/" + objID, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							return response.data.data;
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					add: function (obj) {
						return $http.post(API_BASE_URL + "/system-user", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Record Inserted Successfuly",
								type: 'success',
								duration: 5000,
							};
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					update: function (obj) {
						return $http.put(API_BASE_URL + "/system-user", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Record Updated Successfuly",
								type: 'success',
								duration: 5000,
							};
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					delete: function (obj) {
						if (confirm("Are you sure, you want to delete this record?"))
							return $http.delete(API_BASE_URL + "/system-user/" + obj.id, {
								headers: {
									"X-Access-Token": store.get("token")
								}
							}).then(function (response) {
								$rootScope.message = {
									body: "Record Deleted Successfuly",
									type: 'success',
									duration: 5000,
								};
								$rootScope.$broadcast("refresh_data");
							}, function (error) {
								$rootScope.message = {
									body: error.data.data.message,
									type: 'danger',
									duration: 5000,
								};
							});
					},
				};
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("usersService", ["$rootScope", "$http", "store", "API_BASE_URL", serviceFn]);
	})(services = app.services || (services = {}), User = app.User || (User = {}));
})(app || (app = {}));
