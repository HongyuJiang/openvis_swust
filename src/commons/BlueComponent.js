import * as d3 from 'd3'

export default class BlueComponent {

    constructor(canvas, options) {
        
        let that = this
        this.fill = '#F6BB42' 
        this.stroke = 'none'
        this.name = 'UNAMED'
        this.type = 'default' 
        this.inPorts = [] //Inports of component
        this.outPorts = [] //Outports of component
        this.property = {}
        this.width = 180
        this.dx = 0 //Horizonal delta
        this.dy = 0 //Vertical delta
        this.x = 300 * Math.random() + 100 //Init horizonal position
        this.y = 100 * Math.random() + 100 //Init vertical position
        this.dimPreview = '' 
        this.filterRange = [] //If there have filter plug in component 

        for(let key in options){
            this[key] = options[key] //Set the initial parameter
        }

        this.width = this.name.length > 15 ? this.name.length * 10 : 180 
        this.height = this.inPorts.length > this.outPorts.length ? 50 + this.inPorts.length * 30 : 50 + this.outPorts.length * 30

        this.canvas = canvas

        this.container = canvas
        .datum({'x': this.x, 'y': this.y})
        .append('g')
        .attr('transform', function(d){
            return 'translate(' + d.x + ',' + d.y + ')'
        })

        ////////////////////////////////
        ///Add drag event to component
        ///////////////////////////////
        this.container.call(d3.drag()
            .on("start", function(d){
                that.dragstarted(this, d)
            })
            .on("drag",function(d){
                that.dragged(this, d)
            })
            .on("end", function(d){
                that.dragended(this, d)
            }));
            
        this.draw()
    }
    //Get the current position and delta translation
    getPos(){

        return {'x':this.x,'y':this.y, 'dx':this.dx, 'dy':this.dy}
    }
    //reset the delta translation
    resetDeltaPos(){

        this.dx = 0
        this.dy = 0
    }
    //After been connected by curve, the port name 
    setFieldName(name){

        if(this.outPorts.length > 0){

            this.outPorts[0].name = name

            this.outPorts[0].dimension_type = 'quantitative'
        }

    
       /* if(this.outPorts.length == 1){
            this.outPorts[0].text = this.outPorts[0].name[0].toUpperCase() + 
            this.outPorts[0].name.slice(1, this.outPorts[0].name.length)
            this.outPorts[0].dimension_type = 'quantitative'
        }*/
    }
    //Add a new port to component
    addPort(type, port){

        port.text = port.text[0].toUpperCase() + port.text.slice(1, port.text.length)

        if(type == 'in'){
            this.inPorts.push(port)
        }
        else{
            this.outPorts.push(port)
        }

        this.redraw()
    }
    //Draw the back retangle
    drawBack(height){
        
        this.container
        .append('rect')
        .attr('class','back')
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('width', this.width)
        .attr('height', height || this.height)
        .attr('fill', this.fill)
        .attr('stroke', this.stroke)
        .attr('stroke-width', 2)
    }
    redraw(){
        
        this.container
        .selectAll('.port').remove()

        this.container
        .selectAll('.portname').remove()

        this.height = this.inPorts.length > this.outPorts.length ? 50 + this.inPorts.length * 30 : 50 + this.outPorts.length * 30
        this.container.selectAll('.back').attr('height', this.height)

        this.drawInPorts()
        this.drawOutPorts()

    }
    drawInPorts(){
        let that = this
        this.container
        .selectAll('port')
        .data(this.inPorts)
        .enter()
        .append('circle')
        .attr('class','port')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('cx', function(d){
            d.x = 20
            return d.x
        })
        .attr('cy', function(d,i){
            d.y = 20 + (i+1) * 30
            return d.y
        })
        .attr('r', 6)


        this.container
        .selectAll('portname')
        .data(this.inPorts)
        .enter()
        .append('text')
        .attr('class','portname')
        .attr("text-anchor", "start")
        .attr('alignment-baseline', 'central')
        .attr('x', function(d){
            return 30
        })
        .attr('y', function(d,i){
            return d.y 
        })
        .attr('fill','white')
        .attr('font-size','14')
        .text(function(d){
            return d.text
        })
    }
    drawOutPorts(){
        let that = this
        this.container
        .selectAll('port')
        .data(this.outPorts)
        .enter()
        .append('circle')
        .attr('class','port')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('cx', function(d,i){
            d.x = that.width - 20
            return d.x 
        })
        .attr('cy', function(d,i){
            d.y = 20 + (i+1) * 30
            return d.y
        })
        .attr('r', 6)
        
        this.container
        .selectAll('portname')
        .data(this.outPorts)
        .enter()
        .append('text')
        .attr('class','portname')
        .attr("text-anchor", "end")
        .attr('alignment-baseline', 'central')
        .attr('x', this.width - 30)
        .attr('y', function(d,i){
            return d.y
        })
        .attr('fill','white')
        .attr('font-size','14')
        .text(function(d){
            return d.text
        })
    }
    drawTitle(){
        this.container
        .append('text')
        .attr('x', this.width/2)
        .attr('y', 20)
        .attr("text-anchor", "middle")
        .attr('fill','white')
        .text(this.name.toUpperCase())

        this.container
        .append('line')
        .attr('x1', 0)
        .attr('y1', 30)
        .attr('x2', this.width)
        .attr('y2', 30)
        .attr('stroke','#666')
        .attr('stroke-width','2')
        .attr('font-size','14')
       
    }
    draw(){

        this.drawBack()
        this.drawTitle()
        this.drawInPorts()
        this.drawOutPorts()
        this.drawTitle()
    }
    dragstarted(node, d) {
       // d3.select(node).raise().classed("active", true);
    }
    dragged(node, d){ 

        let that = this

        d3.select(node).attr("transform", function(q){
            that.dx = d3.event.x - that.x
            that.dy = d3.event.y - that.y
            that.x = d.x = d3.event.x
            that.y = d.y = d3.event.y
            return 'translate(' + d.x + ',' + d.y + ')'
        });

        this.container.selectAll('.port')
        .attr('none', function(d){
            d.parentX = that.x
            d.parentY = that.y
        })

    }
    dragended(node,d) {
        d3.select(node).classed("active", false);
    }
    //Get all the ports' circles
    getAllCircles(){

        return this.container.selectAll('.port')
    }
    //Get all the ports
    getAllPorts(){

        let that = this
        let ret = []

        ret['inPorts'] = this.inPorts
        ret['inPorts'].forEach(function(d){

            d.parentX = that.x
            d.parentY = that.y
            d.parent = that.name
            ret.push(d)
        })

        ret['outPorts'] = this.outPorts
        ret['outPorts'].forEach(function(d){

            d.parentX = that.x
            d.parentY = that.y
            d.parent = that.name
            ret.push(d)
        })
        return ret
    }
    //Shows the data distribution in component
    showDataPreview(data, dim){

        this.dimPreview = dim
             
        let that = this
        let bins = {}

        let data_max = d3.max(data, d => d[dim])
        let data_min = d3.min(data, d => d[dim])

        let factor = (data_max - data_min) / 20

        let brush = d3.brushX()
            .extent([[this.width * 0.1, 10], [this.width * 0.9, 50]])
            .on("brush end", brushed);
  
        data.forEach(function(d){

            let q = parseInt((d[dim] - data_min) / factor)

            if(q in bins)
                bins[q] += 1
            else
                bins[q] = 1
        })

        let bins_array = []

        for(let key in bins){

            bins_array.push({'key': key * factor + data_min, 'value': bins[key]})
        }

        let max_x = d3.max(bins_array, d => d.key)
        let min_x = d3.min(bins_array, d => d.key)

        let max_y = d3.max(bins_array, d => d.value)
        let min_y = d3.min(bins_array, d => d.value)

        if(max_y == min_y) min_y -= 1


        let x_scale = d3.scaleLinear()
        .domain([min_x, max_x])
        .range([0, that.width * 0.8])

        let y_scale = d3.scaleLinear()
        .domain([min_y, max_y])
        .range([0,40])

        function brushed(){
            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.

                let selection = d3.event.selection || x_scale.range();
                let range = selection.map(x_scale.invert, x_scale);
                that.filterRange = range
        
        }

        this.filterRange = [min_x, max_x]

        let offset = 30

        this.container.append('line')
        .attr('x1', that.width * 0.1)
        .attr('y1', that.height + offset)
        .attr('x2', that.width * 0.9)
        .attr('y2', that.height + offset)
        .attr('stroke','black')

        let binsChart = this.container.selectAll('bins')
        .data(bins_array)
        .enter()
        .append('rect')
        .attr('x', d => x_scale(d.key) + that.width * 0.1)
        .attr('y', d => that.height + offset - y_scale(d.value) / 2)
        .attr('width', d => 70 / bins_array.length)
        .attr('height', function(d){
            return 0
        })
        .attr('fill','#ccc')
        .attr('stroke','none')

        binsChart.transition()
        .duration(500)
        .attr('delay', 500)
        .attr('height', d => y_scale(d.value))

        this.container.append('text')
        .attr('x', that.width * 0.1)
        .attr('y', that.height + offset)
        .attr('alignment-baseline', 'central')
        .attr('text-anchor','end')
        .attr('fill','white')
        .text(parseInt(min_x))

        this.container.append('text')
        .attr('x', that.width * 0.9)
        .attr('y', that.height + offset)
        .attr('alignment-baseline', 'central')
        .attr('fill','white')
        .text(parseInt(max_x))

        this.container.append('text')
        .attr('x', that.width * 0.5)
        .attr('y', that.height + offset + 25)
        .attr('text-anchor','center')
        .attr('alignment-baseline', 'central')
        .attr('fill','white')
        .text(parseInt(min_y))

        this.container.append('text')
        .attr('x', that.width * 0.5)
        .attr('y', that.height + offset - 25)
        .attr('text-anchor','center')
        .attr('alignment-baseline', 'central')
        .attr('fill','white')
        .text(parseInt(max_y))

        this.container.append("g")
        .attr("class", "brush")
        .call(brush)
        .attr('transform','translate(0,' + that.height + ')')

        that.container.selectAll('.back')
        .transition()
        .attr('height',  that.height + 70)
    }
    //Get the selected range of users' filter operation
    getFilterRangeAndDim(){

        return {'range':this.filterRange,'dim':this.dimPreview}
    }
    //After data joined, add the data name to the ports' name 
    addDataName2Ports(){

        this.outPorts.forEach(d => {

            d.name = d.parent + '&' + d.name;
        })
    }
   

}