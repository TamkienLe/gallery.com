let users = [{"name":"Air meets Water","artist":"Corrine Hunt","year":"2017","category":"sculpture","medium":"wood","description":"Base of a cedar wood plank, carved with additional inlaid composite created from aluminium, animal bone ash and graphite. Three vertical carved cedar wood scultpures on steel dowelling pedestals, two are painted. Three vertical sculptures include carved representations of a raven, eagle, orca with coppers in beak of raven and copper wings on the eagle.","image":"https://media.britishmuseum.org/media/Repository/Documents/2017_12/15_11/4658c788_f74c_4fb1_a1e2_a84a00c28669/mid_ENA3371__a_.jpg"},{"name":"Kaleidoscope eye","artist":"Luke","year":"2020","category":"technolgy","medium":"digital painting","description":"Kaleidoscope eye painting by Luke & Morgan Choice/AvantForm","image":"https://as2.ftcdn.net/v2/jpg/03/79/95/29/1000_F_379952985_wQ0CBLYX2NF38C4ls7pYpOtx5l7LlgUY.jpg"},{"name":"Independence Monument","artist":"Anatoliy Kushch","year":"2001","category":"monument","medium":"bronze","description":"The Independence Monument is a victory column located on Maidan Nezalezhnosti (Independence Square) in Kyiv, commemorating the independence of Ukraine in 1991. A spiral staircase is contained within the column","image":"https://img.freepik.com/premium-photo/aerial-view-kyiv-ukraine-maidan-nezalezhnosti-independence-monument_536604-3873.jpg?w=2000"},{"name":"Dancing in the street","artist":"Lea Roche","year":"2022","category":"painting","medium":"acrylic","description":"Fusion of artistic works (hand painting, Indian inks and acrylic painting + digital work, texture varnish ...) creating unique, matte and glossy texture effects.","image":"https://www.artmajeur.com/medias/standard/l/-/l-roche/artwork/16196815_dancing-in-the-street-80x50.jpg"},{"name":"Hearts and a Watercolor","artist":"Jim Dine","year":"1969","category":"painting","medium":"watercolour","description":"Eight hearts with various decorations. 1969 Etching and watercolour on Chrisbrook handmade paper","image":"https://media.britishmuseum.org/media/Repository/Documents/2015_1/16_8/67ae2ec1_8646_44e8_aa15_a4220094219c/mid_PPA420678.jpg"},{"name":"Untitled (O'Ryan)","artist":"Shari Hatt","year":"2001","category":"photography","medium":"photograph","description":"Materials: chromogenic print (Fujicolor)","image":"https://www.gallery.ca/sites/default/files/styles/ngc_scale_1200/public/8442158_0.jpg?itok=Q_PwLOKk&timestamp=1632405844"},{"name":"Courage My Love","artist":"Sebastian McKinnon","year":"2015","category":"illustration","medium":"midex media","description":"Moon's Daughter had never been so far from home; she wished for glimpses of her father's crescent smile. 'Courage, my love.' said Fox, 'Even in shadow, I see pockets of moonlight in your eyes'. Story excerpt from 'Courage, My Love' by Liam McKinnon.","image":"https://cdn.shopify.com/s/files/1/0172/7018/files/courage5.jpg?5845794268734385417"},{"name":"Hedgehog","artist":"Kimika Hara","year":"2012","category":"embroidery","medium":"needlework","description":"Fantastic use of sequins","image":"https://i.pinimg.com/564x/d2/1a/57/d21a5748cad55f87130d0533246d26b4.jpg"},{"name":"Rhapsody","artist":"Keith Mallett","year":"2010","category":"Painting","medium":"Etching","description":"Rhapsody artist proof etching by Keith Mallett","image":"https://static.wixstatic.com/media/cdd51a_a5b97cfb6b3e4d11bac830d82cc7e947~mv2.jpg/v1/fill/w_320,h_320,fp_0.56_0.26,q_90/cdd51a_a5b97cfb6b3e4d11bac830d82cc7e947~mv2.jpg"},{"name":"Tiny bunny love","artist":"ArtMind","year":"2011","category":"DIY","medium":"clay","description":"Clay bunnies. They make me smile, and you? Happy coding everyone!","image":"http://3.bp.blogspot.com/-h6SoSxCBinQ/Tk-HXL5dkJI/AAAAAAAAG9o/kUHTg7aIWx0/s1600/DSC07880.JPG"}]

//"artist":"Arthur Bozonnet","attack":3,"cardClass":"MAGE","health":2,"name":"Fallen Hero","rarity":"RARE"
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;

  db = client.db('collection');
  db.dropCollection("users", function(err, result){
	  if(err){
			console.log("Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)")
		}else{
				console.log("Cleared users collection.");
		}

		db.collection("users").insertMany(users, function(err, result){
			if(err) throw err;
			console.log("Successfuly inserted " + result.insertedCount + " users.")
			process.exit();
		})
  });
});
