# Stad-Network-Visualization

This is the first version of the d3.js force-directed graph for the outcomes of stad.

Since the network is really big and has many links, I had to set the width and height of the svg high enough such that the force algorithm has place enough for repelling of the nodes. The grouping element inside the svg can then be zoomed in and out to take a more precise view at the network.

Nodes can be dragged through the screen, and when hovering over it shows us to which nodes the selected node is directly linked with by fading out all others, and showing the id's of these nodes. 

Color is used to control visualize gender.
