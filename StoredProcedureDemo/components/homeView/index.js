'use strict';

app.homeView = kendo.observable({
	onShow: function () {},
	afterShow: function () {}
});

// START_CUSTOM_CODE_homeView
// END_CUSTOM_CODE_homeView
(function (parent) {
	var dataProvider = app.data.defaultProvider,
		flattenLocationProperties = function (dataItem) {
			var propName, propValue,
				isLocation = function (value) {
					return propValue && typeof propValue === 'object' &&
						propValue.longitude && propValue.latitude;
				};

			for (propName in dataItem) {
				if (dataItem.hasOwnProperty(propName)) {
					propValue = dataItem[propName];
					if (isLocation(propValue)) {
						dataItem[propName] =
							kendo.format('Latitude: {0}, Longitude: {1}',
								propValue.latitude, propValue.longitude);
					}
				}
			}
		},
		dataSourceOptions = {
			transport: {
				read: function (options) {
					$.ajax({
						type: "POST",
						url: 'https://platform.telerik.com/bs-api/v1/Vem0yY7FcidbN71m/Invoke/SqlProcedures/GetTenMostExpensiveProducts',
						contentType: "application/json",
						success: function (data) {
							if (!data.Result.HasErrors) {
								var result = data.Result;
								var resultSet = result.Data[0]; // the first result set

								// pass the first result set as items of the data source
								options.success(resultSet);
							} else {
								options.error(data);
							}
						},
						error: function (err) {
							options.error(err);
						}
					});
				}
			},

			change: function (e) {
				var data = this.data();
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];

					flattenLocationProperties(dataItem);
				}
			},
			schema: {
				model: {
					fields: {
						'Text': {
							field: 'Text',
							defaultValue: ''
						},
					},
					icon: function () {
						var i = 'globe';
						return kendo.format('km-icon km-{0}', i);
					}
				}
			},
		},
		dataSource = new kendo.data.DataSource(dataSourceOptions),
		homeViewModel = kendo.observable({
			dataSource: dataSource
		});

	parent.set('homeViewModel', homeViewModel);
})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
// END_CUSTOM_CODE_homeViewModel