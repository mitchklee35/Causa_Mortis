anychart.onDocumentReady(function(){
    //creating the data
    var data = 
    [{'from': 'all deaths', 'to': "Alzheimer's disease", 'weight': 1494816}, {'from': 'all deaths', 'to': 'CLRD', 'weight': 2594927}, {'from': 'all deaths', 'to': 'Cancer', 'weight': 10843644}, {'from': 'all deaths', 'to': 'Diabetes', 'weight': 1399943}, {'from': 'all deaths', 'to': 'Heart disease', 'weight': 12222640}, {'from': 'all deaths', 'to': 'Influenza and pneumonia', 'weight': 1094641}, {'from': 'all deaths', 'to': 'Kidney disease', 'weight': 858613}, {'from': 'all deaths', 'to': 'Stroke', 'weight': 2726523}, {'from': 'all deaths', 'to': 'Suicide', 'weight': 697016}, {'from': 'all deaths', 'to': 'Unintentional injuries', 'weight': 2347820}]
    //calling the Sankey function
var sankey_chart = anychart.sankey(data);

//customizing the width of the nodes
sankey_chart.nodeWidth("20%");

//setting the chart title
sankey_chart.title("United States Death from 1999 to 2017");

//customizing the vertical padding of the nodes
sankey_chart.nodePadding(20);

//setting the container id
sankey_chart.container("sankey");

//initiating drawing the Sankey diagram
sankey_chart.draw();

});