$(document).ready(function(){
  var finderApp = angular.module('finderApp', []);
	$form = $('#form-add');
	var errordiv = $("#error");

   function limparForm(campos){
    errordiv.text("");
    errordiv.addClass("hidden");
    for(var i in campos){
      $("#"+campos[i]).val("");
    }
  }

  function carregarSeries(){
    //Limpa tabela para recolocar
    $('.linha-serie').remove();
    $.post('http://localhost/finder/server',{
      'request': 'getshows'
    },function(data){
      var series = $.parseJSON(data);
      var seriesarray=[];
      if(series.error) console.log("ERROR: "+series.error_details);
      else{
        for(var i in series.values) mostrarSerie(series.values[i]);

      }
    });
  }

	function mostrarSerie(serie){
		var linha="<tr class='linha-serie'>";
		linha+= "<td> <label ng-hide='esconde'>"+serie.id+"</label> </td>";
		linha+= "<td>"+serie.name+"</td>";
		linha+= "<td>"+serie.year+"</td>";
		linha+= "<td>"+serie.gender+"</td>";
		linha+= "<td> <input class='bt-delete' type='button' value='Remover'> <input class='bt-edit' type='button' ng-model='esconde' value='Editar'> </td>";
		linha+= "</tr>";
		var $linhaTabela=$(linha);
		/*$linhaTabela.find(".bt-delete").click(function(){
			$linhaTabela.fadeOut(400, function(){ 
      			$linhaTabela.remove(); 
    		}); 
		});*/
		$linhaTabela.find(".bt-delete").click(function(){
			deletarSerie(serie.id);
		});
		$("#series-table").append($linhaTabela);
	}

	function deletarSerie(id){
		$.post('http://localhost/finder/server', {'request':'deleteshow', 'id': id} ,function(data){
  		var result = $.parseJSON(data);
  		if(result.error) console.log("ERROR: "+result.error_details);
  		else{
  			carregarSeries();
  		}
  	});
  };

  function mostrarErros(avisos){
  	var text = "";
  	for(var i in avisos){
  			console.log(avisos[i]);
          text+=avisos[i]+ "<br>";
        }
    console.log(text);
  	errordiv.removeClass("hidden");
  	errordiv.html(text);
  }

  function addSerie(serie){
  	serie.request = 'newshow';
  	$.post('http://localhost/finder/server', serie ,function(data){
  		var series = $.parseJSON(data);
  		if(series.error) console.log("ERROR: "+series.error_details);
  		else{
  			carregarSeries();
  		}
  	});
  }

  finderApp.controller('formCtrl', function($scope){
    $scope.itens = carregarSeries();
  });

  limparForm();
  carregarSeries();

	$form.submit(function(e){
		e.preventDefault();
		
		//insere em uma variavel os valores, coloca o nome dos campos em um array e já verifica se está vazio
		var serie = {};
		var campos = [];
		var avisos=[];
		var vazio=false;
        $form.find("input").each(function (i, input) {
          var $input = $(input);
          var nome = $input.attr('name')
          serie[nome] = $input.val();
          campos.push(nome);
          if($input.val() === ''){
          	vazio=true;
          }
        });

        var erro=false;
        if(vazio){
        	avisos.push("Todos os campos são obrigatórios!");
        	erro=true;	
        }else{
        	//verifica id (somente numeros)
        	if($.isNumeric(serie.id)===false){
        		avisos.push("ID deve ser um número!");
        		erro=true;
        	}
    		if($.isNumeric(serie.year)===false){
        		avisos.push("Ano deve ser um número!");
        		erro=true;
        	}else if(Number(serie.year)<1900 || Number(serie.year)>2100){
        		erro=true;
        		avisos.push("Ano inválido");
        	}
        }

        if(erro){
        	mostrarErros(avisos);
        }else{
        	limparForm(campos);
       		addSerie(serie);
        }
	});
});