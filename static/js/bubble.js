function buildplot() {
    // console.log("hello world again")
    d3.json('http://127.0.0.1:5000/api/v1.0/causa-mortis').then(function (data) {
        // Log data to view
        console.log(data)
        // Create a lookup table to sort and regroup the columns of data,
        // first by year, then by cause_name:
        var lookup = [];
        function getData(year, cause_name) {
            var byYear, trace;
            if (!(byYear = lookup[year])) {
                ;
                byYear = lookup[year] = {};
            }
            // If a container for this year + cause_name doesn't exist yet,
            // then create one:
            if (!(trace = byYear[cause_name])) {
                trace = byYear[cause_name] = {
                    x: [],
                    y: [],
                    id: [],
                    text: [],
                    marker: { size: [] }
                };
            }
            return trace;
        }
        console.log(data)

        // Go through each row, get the right trace, and append the data:
        for (var i = 0; i < data.year.length; i++) {
            var year = data.year[i]
            var cause_name = data.cause_name[i]
            var state = data.state[i]
            var adj_dr = data.adj_dr[i]
            var deaths = data.deaths[i]
            var trace = getData(year, cause_name);
            trace.text.push(state);
            trace.id.push(state);
            trace.x.push(adj_dr);
            trace.y.push(deaths);
            trace.marker.size.push(deaths * 3000);
        }

        // Get the group names:
        var years = Object.keys(lookup);
        // In this case, every year includes every cause_name, so we
        // can just infer the cause from the *first* year:
        var firstYear = lookup[years[0]];
        var cause = Object.keys(firstYear);

        // Create the main traces, one for each cause_name:
        var traces = [];
        for (i = 0; i < cause.length; i++) {
            var data = firstYear[cause[i]];
            // One small note. We're creating a single trace here, to which
            // the frames will pass data for the different years. It's
            // subtle, but to avoid data reference problems, we'll slice
            // the arrays to ensure we never write any new data into our
            // lookup table:
            traces.push({
                name: cause[i],
                x: data.x.slice(),
                y: data.y.slice(),
                id: data.id.slice(),
                text: data.text.slice(),
                mode: 'markers',
                marker: {
                    size: data.marker.size.slice(),
                    sizemode: 'area',
                    sizeref: 100000,
                    color: 'Blackbody'
                }
            });
        }

        // Create a frame for each year. Frames are effectively just
        // traces, except they don't need to contain the *full* trace
        // definition (for example, appearance). The frames just need
        // the parts the traces that change (here, the data).
        var frames = [];
        for (i = 0; i < years.length; i++) {
            frames.push({
                name: years[i],
                data: cause.map(function (cause_name) {
                    return getData(years[i], cause_name);
                })
            })
        }

        // Now create slider steps, one for each frame. The slider
        // executes a plotly.js API command (here, Plotly.animate).
        // In this example, we'll animate to one of the named frames
        // created in the above loop.
        var sliderSteps = [];
        for (i = 0; i < years.length; i++) {
            sliderSteps.push({
                method: 'animate',
                label: years[i],
                args: [[years[i]], {
                    mode: 'immediate',
                    transition: { duration: 300 },
                    frame: { duration: 300, redraw: false },
                }]
            });
        }

        var layout = {
            xaxis: {
                title: 'Age Adjusted Death Rate per 100k population',
                range: [0, 350]
            },
            yaxis: {
                title: 'Number of Deaths',
                type: 'log'
            },
            hovermode: 'closest',
            // We'll use updatemenus (whose functionality includes menus as
            // well as buttons) to create a play button and a pause button.
            // The play button works by passing `null`, which indicates that
            // Plotly should animate all frames. The pause button works by
            // passing `[null]`, which indicates we'd like to interrupt any
            // currently running animations with a new list of frames. Here
            // The new list of frames is empty, so it halts the animation.
            updatemenus: [{
                x: 0,
                y: 0,
                yanchor: 'top',
                xanchor: 'left',
                showactive: false,
                direction: 'left',
                type: 'buttons',
                pad: { t: 87, r: 10 },
                buttons: [{
                    method: 'animate',
                    args: [null, {
                        mode: 'immediate',
                        fromcurrent: true,
                        transition: { duration: 300 },
                        frame: { duration: 500, redraw: false }
                    }],
                    label: 'Play'
                }, {
                    method: 'animate',
                    args: [[null], {
                        mode: 'immediate',
                        transition: { duration: 0 },
                        frame: { duration: 0, redraw: false }
                    }],
                    label: 'Pause'
                }]
            }],
            // Finally, add the slider and use `pad` to position it
            // nicely next to the buttons.
            sliders: [{
                pad: { l: 130, t: 55 },
                currentvalue: {
                    visible: true,
                    prefix: 'Year:',
                    xanchor: 'right',
                    font: { size: 20, color: '#666' }
                },
                steps: sliderSteps
            }]
        };

        // Create the plot:
        Plotly.newPlot('bubble', {
            data: traces,
            layout: layout,
            frames: frames,
        });
    });
};

buildplot();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", buildplot);